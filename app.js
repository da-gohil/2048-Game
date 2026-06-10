document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const bestDisplay = document.getElementById('best')
    let resultDisplay = document.getElementById('result')

    // ---- Theme: persist choice, fall back to the OS preference ----
    const themeToggle = document.getElementById('theme-toggle')
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    const themeBg = { light: '#FFFFFF', dark: '#07070F' }
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme)
        if (themeColorMeta) themeColorMeta.setAttribute('content', themeBg[theme])
    }
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'))
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
            applyTheme(next)
            localStorage.setItem('theme', next)
        })
    }

    // ---- Keep the page static on mobile: block page-level pan/bounce ----
    document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })

    // ---- Best score, persisted across sessions ----
    let score = 0
    let best = parseInt(localStorage.getItem('best')) || 0
    if (bestDisplay) bestDisplay.innerHTML = best
    function syncScore() {
        scoreDisplay.innerHTML = score
        if (score > best) {
            best = score
            localStorage.setItem('best', String(best))
            if (bestDisplay) bestDisplay.innerHTML = best
        }
    }

    // If the HTML doesn't have a #result element, create one as a full-board overlay
    if (!resultDisplay) {
        resultDisplay = document.createElement('div')
        resultDisplay.id = 'result'
        resultDisplay.className = 'result-overlay'
        resultDisplay.innerHTML = `
            <div class="result-card">
                <p class="result-text"></p>
                <button class="result-restart" type="button">Play again</button>
            </div>
        `
        gridDisplay.appendChild(resultDisplay)
    }
    const restartButton = document.getElementById('restart')

    // ============================================================
    //  Board engine — tile-based model with FLIP slide animations
    // ============================================================
    const SIZE = 4
    const CELLS = SIZE * SIZE
    const ANIM_MS = 100 // slide duration cap

    // board[i] holds a tile object { value, el, idx } or null. i = row*4 + col
    const board = new Array(CELLS).fill(null)
    let isAnimating = false
    let gameOver = false

    // Build the two layers: static background slots + the moving tile layer
    const cellsLayer = document.createElement('div')
    cellsLayer.className = 'cells'
    for (let i = 0; i < CELLS; i++) {
        const cell = document.createElement('div')
        cell.className = 'cell'
        cellsLayer.appendChild(cell)
    }
    const tilesLayer = document.createElement('div')
    tilesLayer.className = 'tiles'
    // Insert layers before the overlay so the overlay (z-index) stays on top
    gridDisplay.insertBefore(tilesLayer, resultDisplay)
    gridDisplay.insertBefore(cellsLayer, tilesLayer)

    // Position a tile element on the grid track for board index i
    function placeEl(el, i) {
        el.style.gridColumnStart = String((i % SIZE) + 1)
        el.style.gridRowStart = String(Math.floor(i / SIZE) + 1)
    }

    function createTile(value, i) {
        const el = document.createElement('div')
        el.className = 'tile'
        el.textContent = value
        el.setAttribute('data-value', String(value))
        placeEl(el, i)
        tilesLayer.appendChild(el)
        return { value, el, idx: i, mergeTo: null }
    }

    // Spawn a 2 (90%) or 4 (10%) in a random empty cell, with a pop-in
    function generate() {
        const empty = []
        for (let i = 0; i < CELLS; i++) if (!board[i]) empty.push(i)
        if (!empty.length) return
        const i = empty[Math.floor(Math.random() * empty.length)]
        const value = Math.random() < 0.9 ? 2 : 4
        const tile = createTile(value, i)
        board[i] = tile
        tile.el.classList.add('is-new')
        setTimeout(() => tile.el.classList.remove('is-new'), 160)
    }

    // Indices for each line (row/column) ordered from the wall outward
    function lineOrder(dir) {
        const lines = []
        if (dir === 'left' || dir === 'right') {
            for (let r = 0; r < SIZE; r++) {
                const row = [0, 1, 2, 3].map(c => r * SIZE + c)
                lines.push(dir === 'left' ? row : row.reverse())
            }
        } else {
            for (let c = 0; c < SIZE; c++) {
                const col = [0, 1, 2, 3].map(r => r * SIZE + c)
                lines.push(dir === 'up' ? col : col.reverse())
            }
        }
        return lines
    }

    function move(dir) {
        if (isAnimating || gameOver) return

        // FLIP step 1: record where every tile is right now
        const firstRects = new Map()
        tilesLayer.querySelectorAll('.tile').forEach(el => firstRects.set(el, el.getBoundingClientRect()))

        let moved = false
        let scoreGain = 0
        const removed = [] // absorbed tiles, deleted after the slide
        const popped = []  // survivors that merged, get a bump after the slide

        for (const line of lineOrder(dir)) {
            const tiles = line.map(i => board[i]).filter(Boolean)
            line.forEach(i => { board[i] = null })

            let target = 0
            let k = 0
            while (k < tiles.length) {
                const cur = tiles[k]
                const ti = line[target]
                if (k + 1 < tiles.length && tiles[k + 1].value === cur.value) {
                    // Merge: both slide to the same slot; survivor doubles afterward
                    const absorbed = tiles[k + 1]
                    placeEl(cur.el, ti); cur.idx = ti
                    placeEl(absorbed.el, ti)
                    board[ti] = cur
                    cur.mergeTo = cur.value * 2
                    scoreGain += cur.mergeTo
                    removed.push(absorbed.el)
                    popped.push(cur)
                    moved = true
                    k += 2
                } else {
                    if (cur.idx !== ti) moved = true
                    placeEl(cur.el, ti); cur.idx = ti
                    board[ti] = cur
                    k += 1
                }
                target += 1
            }
        }

        if (!moved) return

        // FLIP steps 2-4: measure new spot, invert to old spot, then play to new
        isAnimating = true
        const els = Array.from(tilesLayer.querySelectorAll('.tile'))
        els.forEach(el => {
            const first = firstRects.get(el)
            if (!first) return
            const last = el.getBoundingClientRect()
            const dx = first.left - last.left
            const dy = first.top - last.top
            if (dx || dy) {
                el.style.transition = 'none'
                el.style.transform = `translate(${dx}px, ${dy}px)`
            }
        })
        void tilesLayer.offsetWidth // force reflow so the invert takes hold
        els.forEach(el => {
            if (el.style.transform) {
                el.style.transition = ''
                el.style.transform = ''
            }
        })

        setTimeout(() => finalize(removed, popped, scoreGain), ANIM_MS)
    }

    function finalize(removed, popped, scoreGain) {
        removed.forEach(el => el.remove())
        popped.forEach(t => {
            t.value = t.mergeTo
            t.mergeTo = null
            t.el.textContent = t.value
            t.el.setAttribute('data-value', String(t.value))
            t.el.classList.remove('is-merged')
            void t.el.offsetWidth
            t.el.classList.add('is-merged')
        })
        if (scoreGain) { score += scoreGain; syncScore() }

        const won = popped.some(t => t.value === 2048)
        generate()
        isAnimating = false

        if (won) { showResult('You WIN!', 'win'); gameOver = true; return }
        if (isGameOver()) { showResult('You Lose!', 'lose'); gameOver = true }
    }

    // Over only when the board is full AND no adjacent pair can still merge
    function isGameOver() {
        for (let i = 0; i < CELLS; i++) if (!board[i]) return false
        for (let i = 0; i < CELLS; i++) {
            const v = board[i].value
            if ((i % SIZE !== SIZE - 1) && board[i + 1] && board[i + 1].value === v) return false
            if (i < CELLS - SIZE && board[i + SIZE] && board[i + SIZE].value === v) return false
        }
        return true
    }

    function showResult(message, kind) {
        resultDisplay.classList.add('is-visible', kind)
        const textNode = resultDisplay.querySelector('.result-text')
        if (textNode) textNode.textContent = message
    }

    function restart() {
        score = 0
        scoreDisplay.innerHTML = 0
        resultDisplay.classList.remove('is-visible', 'win', 'lose')
        tilesLayer.innerHTML = ''
        for (let i = 0; i < CELLS; i++) board[i] = null
        gameOver = false
        isAnimating = false
        generate()
        generate()
    }

    // ---- Input: keyboard + swipe both funnel into move() ----
    function keyLeft()  { move('left') }
    function keyRight() { move('right') }
    function keyUp()    { move('up') }
    function keyDown()  { move('down') }

    function control(e) {
        if (e.key === 'ArrowLeft') keyLeft()
        else if (e.key === 'ArrowRight') keyRight()
        else if (e.key === 'ArrowUp') keyUp()
        else if (e.key === 'ArrowDown') keyDown()
    }
    document.addEventListener('keydown', control)

    // Swipe fires mid-gesture (the instant the threshold is crossed) so it feels instant
    let touchStartX = 0
    let touchStartY = 0
    let swipeHandled = false
    const SWIPE_THRESHOLD = 22

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        swipeHandled = false
    }, { passive: true })

    document.addEventListener('touchmove', (e) => {
        if (swipeHandled) return
        const dx = e.touches[0].clientX - touchStartX
        const dy = e.touches[0].clientY - touchStartY
        const absX = Math.abs(dx)
        const absY = Math.abs(dy)
        if (Math.max(absX, absY) < SWIPE_THRESHOLD) return

        swipeHandled = true // one drag => one move
        if (absX > absY) { if (dx > 0) keyRight(); else keyLeft() }
        else { if (dy > 0) keyDown(); else keyUp() }
    }, { passive: true })

    restartButton.addEventListener('click', restart)
    const overlayRestart = resultDisplay.querySelector('.result-restart')
    if (overlayRestart) overlayRestart.addEventListener('click', restart)

    // ---- Kick off ----
    generate()
    generate()
})

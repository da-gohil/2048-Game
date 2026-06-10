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
    // (Swipes inside the board are still handled by the game's touch logic.)
    document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })

    // ---- Best score, persisted across sessions ----
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
    // console.log(gridDisplay);
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
        // Place the overlay inside the grid so it sits on top of the board
        gridDisplay.appendChild(resultDisplay)
    }
    // Restart button lives in the scoreboard (see index.html)
    const restartButton = document.getElementById('restart')
    const width = 4
    let squares = []
    let score = 0
    // Create the play board 4 X 4 = 16 tiles
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.innerHTML = 0
            square.setAttribute('data-value', '0')
            gridDisplay.appendChild(square)
            squares.push(square)
        }
        //call twice for 2's 
        generate()
        generate()
    }
    createBoard()
    //generate a new number
    function generate() {
        // Pick from the list of empty cells directly — no recursion, no infinite loops
        const emptyIndices = []
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) emptyIndices.push(i)
        }
        if (emptyIndices.length === 0) return
        const randomNumber = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
        // console.log(randomNumber)
        // Real 2048 spawns a 4 about 10% of the time
        const newValue = Math.random() < 0.9 ? 2 : 4
        squares[randomNumber].innerHTML = newValue
        squares[randomNumber].setAttribute('data-value', String(newValue))
        // Pop the freshly spawned tile in
        const fresh = squares[randomNumber]
        fresh.classList.add('is-new')
        setTimeout(() => fresh.classList.remove('is-new'), 200)
        //checkForGameOver
        checkForGameOver()
    }
    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 == 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
                // console.log(row)
                //filter the row
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)
                // console.log("filtered row " + filteredRow)
                // console.log("new row " + newRow)
                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }
    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + 1].innerHTML
                let totalThree = squares[i + 2].innerHTML
                let totalFour = squares[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
                // console.log(row)
                //filter the row
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)
                // console.log("filtered row " + filteredRow)
                // console.log("new row " + newRow)
                squares[i].innerHTML = newRow[0]
                squares[i + 1].innerHTML = newRow[1]
                squares[i + 2].innerHTML = newRow[2]
                squares[i + 3].innerHTML = newRow[3]
            }
        }
    }
    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + width * 2].innerHTML
            let totalFour = squares[i + width * 3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            // console.log(row)
            //filter the row
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)
            // console.log("filtered row " + filteredRow)
            // console.log("new row " + newRow)
            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + width * 2].innerHTML = newColumn[2]
            squares[i + width * 3].innerHTML = newColumn[3]
        }
    }
    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i + width].innerHTML
            let totalThree = squares[i + width * 2].innerHTML
            let totalFour = squares[i + width * 3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            // console.log(row)
            //filter the row
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)
            // console.log("filtered row " + filteredRow)
            // console.log("new row " + newRow)
            squares[i].innerHTML = newColumn[0]
            squares[i + width].innerHTML = newColumn[1]
            squares[i + width * 2].innerHTML = newColumn[2]
            squares[i + width * 3].innerHTML = newColumn[3]
        }
    }
    function combineColumn() {
        // Iterate bottom-up so the lower pair merges first on a Down move
        for (let i = 11; i >= 0; i--) {
            //First check if we do not combine tile across different rows
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + width].innerHTML = 0
                score += combinedTotal
                syncScore()
            }
        }
    }
    function combineRow() {
        // Iterate right-to-left so the rightmost pair merges first on a Right move
        for (let i = 14; i >= 0; i--) {
            //First check if we do not combine tile across different rows
            if ((i + 1) % 4 !== 0) {
                if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                    let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
                    squares[i].innerHTML = combinedTotal
                    squares[i + 1].innerHTML = 0
                    score += combinedTotal
                    syncScore()
                }
            }
        }
        //CheckforWin()
        checkWin()
    }
    // Snapshot the board so we can tell if a move actually changed anything
    function snapshot() {
        return squares.map(sq => sq.innerHTML).join(',')
    }
    //assign function to the keys
    function control(e) {
        if (e.key === 'ArrowLeft') {
            keyLeft()
        } else if (e.key === 'ArrowRight') {
            keyRight()
        } else if (e.key === 'ArrowUp') {
            keyUp()
        } else if (e.key === 'ArrowDown') {
            keyDown()
        }
    }
    document.addEventListener('keydown', control)

    // Touch support — translate swipes into the same key handlers
    let touchStartX = 0
    let touchStartY = 0

    gridDisplay.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
    }, { passive: true })

    gridDisplay.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX
        const dy = e.changedTouches[0].clientY - touchStartY
        const absX = Math.abs(dx)
        const absY = Math.abs(dy)

        // Ignore taps and tiny drags
        if (Math.max(absX, absY) < 30) return

        if (absX > absY) {
            if (dx > 0) keyRight()
            else keyLeft()
        } else {
            if (dy > 0) keyDown()
            else keyUp()
        }
    }, { passive: true })

    function keyLeft() {
        const before = snapshot()
        moveLeft()
        combineRow()
        moveLeft()
        addColors()
        if (snapshot() !== before) generate()
    }
    function keyRight() {
        const before = snapshot()
        moveRight()
        combineRow()
        moveRight()
        addColors()
        if (snapshot() !== before) generate()
    }
    function keyUp() {
        const before = snapshot()
        moveUp()
        combineColumn()
        moveUp()
        addColors()
        if (snapshot() !== before) generate()
    }
    function keyDown() {
        const before = snapshot()
        moveDown()
        combineColumn()
        moveDown()
        addColors()
        if (snapshot() !== before) generate()
    }
    //check for number 2048 in the squares to WIN function
    function checkWin(){
        for(let i =0; i<squares.length; i++){
            if(squares[i].innerHTML == 2048){
                showResult('You WIN!', 'win')
                document.removeEventListener('keydown', control)
                return
            }
        }
    }
    function checkForGameOver(){
        // A board is "over" only if it's full AND no adjacent pair can still merge
        let zeroes = 0
        for(let i =0; i< squares.length; i++){
            if(squares[i].innerHTML == 0){
                zeroes++
            }
        }
        if (zeroes > 0) return
        // Board is full — check whether any adjacent horizontal or vertical pair is equal
        for (let i = 0; i < squares.length; i++) {
            const v = squares[i].innerHTML
            // right neighbor (skip if at right edge)
            if ((i + 1) % 4 !== 0 && squares[i + 1].innerHTML === v) return
            // down neighbor (skip if in bottom row)
            if (i < 12 && squares[i + width].innerHTML === v) return
        }
        showResult('You Lose!', 'lose')
        document.removeEventListener('keydown', control)
    }
    //add colours
    function addColors(){
        for(let i = 0; i<squares.length; i++){
            // Sync data-value with the current cell number so the CSS picks the right tile color
            squares[i].setAttribute('data-value', String(squares[i].innerHTML))
        }
    }
    // Show the win/lose overlay with the right styling hook
    function showResult(message, kind) {
        resultDisplay.classList.add('is-visible', kind)
        const textNode = resultDisplay.querySelector('.result-text')
        if (textNode) textNode.textContent = message
    }
    // Reset the game to a fresh state
    function restart() {
        score = 0
        scoreDisplay.innerHTML = 0
        resultDisplay.classList.remove('is-visible', 'win', 'lose')
        for (let i = 0; i < squares.length; i++) {
            squares[i].innerHTML = 0
            squares[i].setAttribute('data-value', '0')
        }
        document.removeEventListener('keydown', control)
        document.addEventListener('keydown', control)
        generate()
        generate()
    }
    restartButton.addEventListener('click', restart)
    // The "Play again" button inside the overlay also restarts
    const overlayRestart = resultDisplay.querySelector('.result-restart')
    if (overlayRestart) overlayRestart.addEventListener('click', restart)
})
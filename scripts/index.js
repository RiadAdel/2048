class game_2048 {
    constructor(size = 4) {
        this.size = size > 3 ? size : 4
        this.score = 0

        // create the board
        this.state = Array(size)
        for (let i = 0; i < size; i++) {
            this.state[i] = Array(size).fill(0)
        }
        // get two random places
        let item1 = [Math.floor(Math.random() * size), Math.floor(Math.random() * size)]
        let item2 = item1
        while (JSON.stringify(item1) == JSON.stringify(item2)) {
            item2 = [Math.floor(Math.random() * size), Math.floor(Math.random() * size)]
        }
        // fill the initialization of the board
        this.state[item1[0]][item1[1]] = 2
        this.state[item2[0]][item2[1]] = 4
    }

    addTwoToBoard() {
        const freeSpaces = this.state.reduce((array, elm, index) => {
            elm.forEach((val, i) => val == 0 ? array.push([index, i]) : null)
            return array
        }, Array())

        if (!freeSpaces.length)
            return

        const randPlace = freeSpaces[Math.floor(Math.random() * freeSpaces.length)]

        this.state[randPlace[0]][randPlace[1]] = 2
    }

    down() {
        let start = this.size - 1;

        for (let col = 0; col < this.size; col++) {
            start = this.size - 1;
            for (let row = start - 1; row >= 0; row--) {
                if (!this.state[start][col]) {
                    start = row
                }
                else if (this.state[start][col] == this.state[row][col]) {
                    this.state[start][col] *= 2
                    this.state[row][col] = 0
                    this.score += this.state[start][col]
                    start = row
                }
                else if (this.state[row][col])
                    start = row
            }
        }

        let nonZeroCols = Array(this.size).fill(0)
        nonZeroCols = this.state.reduce(function (cols, row) {
            row.forEach((val, i) => {
                if (!cols[i]) {
                    cols[i] = new Array()
                }
                if (val > 0) {
                    cols[i].push(val)
                }
            })
            return cols

        }, nonZeroCols)

        for (let col = 0; col < this.size; col++) {
            let n = nonZeroCols[col].length
            for (let row = 0; row < this.size; row++)
                this.state[row][col] = row < (this.size - n) ? 0 : nonZeroCols[col].shift()
        }


    }

    up() {
        let start = 0;

        for (let col = 0; col < this.size; col++) {
            start = 0
            for (let row = 1; row < this.size; row++) {
                if (!this.state[start][col]) {
                    start = row
                }
                else if (this.state[start][col] == this.state[row][col]) {
                    this.state[start][col] *= 2
                    this.state[row][col] = 0
                    this.score += this.state[start][col]
                    start = row
                }
                else if (this.state[row][col])
                    start = row
            }
        }

        let nonZeroCols = Array(this.size).fill(0)
        nonZeroCols = this.state.reduce(function (cols, row) {
            row.forEach((val, i) => {
                if (!cols[i]) {
                    cols[i] = new Array()
                }
                if (val > 0) {
                    cols[i].push(val)
                }
            })
            return cols

        }, nonZeroCols)

        for (let col = 0; col < this.size; col++) {
            let n = nonZeroCols[col].length
            for (let row = 0; row < this.size; row++)
                this.state[row][col] = row < n ? nonZeroCols[col].shift() : 0
        }

    }

    left() {
        let start = 0
        for (let row = 0; row < this.size; row++) {
            start = 0
            for (let col = 1; col < this.size; col++)
                if (this.state[row][start] == 0)
                    start = col
                else if (this.state[row][start] == this.state[row][col]) {
                    this.state[row][start] *= 2
                    this.state[row][col] = 0
                    start = col
                }
                else if (this.state[row][col])
                    start = col
        }
        for (let row = 0; row < this.size; row++) {
            let nonZeros = this.state[row].filter((elm) => elm > 0)
            this.state[row] = nonZeros.concat(Array(this.size - nonZeros.length).fill(0))
        }
    }

    right() {
        let start = this.size - 1
        for (let row = 0; row < this.size; row++) {
            start = this.size - 1
            for (let col = start - 1; col >= 0; col--)
                if (this.state[row][start] == 0)
                    start = col
                else if (this.state[row][start] == this.state[row][col]) {
                    this.state[row][start] *= 2
                    this.state[row][col] = 0
                    start = col
                }
                else if (this.state[row][col])
                    start = col
        }
        for (let row = 0; row < this.size; row++) {
            let nonZeros = this.state[row].filter((elm) => elm > 0)
            this.state[row] = Array(this.size - nonZeros.length).fill(0).concat(nonZeros)
        }
    }

    isGameOver() {
        for (let row = 0; row < this.size; row++)
            for (let col = 0; col < this.size; col++) {
                if (!this.state[row][col])
                    return false
                if(row != this.size-1 && this.state[row][col] == this.state[row+1][col])
                    return false
                if(col != this.size-1 && this.state[row][col] == this.state[row][col+1])
                    return false
            }

        
        return true
    }

    reset() {
        this.state.forEach(elm => elm.fill(0))
    }
}


function drawBoard(parent, matrix) {
    parent.innerHTML = ""
    matrix.forEach((row, ri) => row.forEach(function (val, ci) {
        let valContainer = document.createElement("div")
        valContainer.innerText = val
        valContainer.style.display = "flex"
        valContainer.style.justifyContent = "center"
        valContainer.style.alignItems = "center"
        valContainer.style.fontSize = "2em"
        valContainer.style.gridArea = `${ri + 1}/${ci + 1}/${ri + 2}/${ci + 2} `
        parent.appendChild(valContainer)
    }))
}

document.addEventListener("DOMContentLoaded", function (e) {
    let game = new game_2048()
    let mainEml = document.getElementsByTagName("main")[0]
    mainEml.style.gridTemplateColumns = mainEml.style.gridTemplateRows = Array(game.size).fill("1fr").join(" ")
    drawBoard(mainEml, game.state)
    document.addEventListener('keydown', function (e) {
        if(game.isGameOver()){
            console.log("GameOver")
            return
        }
        switch (e.code) {
            case "ArrowUp":
                game.up();
                game.addTwoToBoard();
                break;
            case "ArrowDown":
                game.down();
                game.addTwoToBoard();
                break;
            case "ArrowLeft":
                game.left();
                game.addTwoToBoard();
                break;
            case "ArrowRight":
                game.right();
                game.addTwoToBoard();
                break;
            default:
        }
        drawBoard(mainEml, game.state)
        console.log(game.score)
    })
})

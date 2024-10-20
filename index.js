let numSelected = null;
let errors = 0;
let timer; // Store the timer interval
let seconds = 0;
let gameStarted = false; // Track if the timer has started

const gameSets = [

    {
        board: [
            "--74916-5",
            "2---6-3-9",
            "-----7-1-",
            "-586----4",
            "--3----9-",
            "--62--187",
            "9-4-7---2",
            "67-83----",
            "81--45---"
        ],
        solution: [
            "387491625",
            "241568379",
            "569327418",
            "758619234",
            "123784596",
            "496253187",
            "934176852",
            "675832941",
            "812945763"
        ]
    },

    {
        board: [
            "--6513---",
            "---9-4-36",
            "3-2-6--1-",
            "-63------",
            "48--7-39-",
            "--9-3--65",
            "-----7---",
            "---64----",
            "657--192-"
        ],
        solution: [
            "896513247",
            "571924836",
            "342768519",
            "263459781",
            "485176392",
            "719832465",
            "134297658",
            "928645173",
            "657381924"
        ]
    }
];

    

let currentGame; // Variable to store the current game set

window.onload = function() {
    setGame();
    document.getElementById("solve-btn").addEventListener("click", solveBoard);
    document.getElementById("reset-btn").addEventListener("click", resetGame);
    document.getElementById("toggle-theme-btn").addEventListener("click", toggleDarkMode);
};

function setGame() {
    // Reset errors and UI
    document.getElementById("errors").innerText = "Errors: 0";
    errors = 0;

    // Randomly select a game set
    const randomIndex = Math.floor(Math.random() * gameSets.length);
    currentGame = gameSets[randomIndex]; // Get the selected game set

    // Create number selectors (1-9)
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", startTimerOnFirstAction);
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Create the 9x9 board
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (currentGame.board[r][c] !== "-") {
                tile.innerText = currentGame.board[r][c];
                tile.classList.add("tile-start");
            }
            if (r === 2 || r === 5) tile.classList.add("horizontal-line");
            if (c === 2 || c === 5) tile.classList.add("vertical-line");

            tile.addEventListener("click", startTimerOnFirstAction);
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").appendChild(tile);
        }
    }
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText !== "") return; // Prevent overwriting existing tiles

        let [r, c] = this.id.split("-").map(Number);

        // Place the selected number if it is correct
        if (currentGame.solution[r][c] === numSelected.id) {
            this.innerText = numSelected.id; // Place the number in the tile
            this.classList.add("tile-solved"); // Add solved style
            // Check if the board is solved after placing a number
            if (checkIfSolved()) {
                clearInterval(timer); // Stop the timer
                alert("Congratulations! You've solved the puzzle!");
            }
        } else {
            errors++;
            document.getElementById("errors").innerText = "Errors: " + errors;
        }
    }
}

// Timer Functionality
function startTimerOnFirstAction() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(updateTimer, 1000); // Start the timer
    }
}

function updateTimer() {
    seconds++;
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    document.getElementById("timer").innerText = 
        `Time: ${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Solve the board using backtracking
function solveBoard() {
    const copyOfBoard = currentGame.board.map(row => row.split(''));
    if (solve(copyOfBoard, 0, 0)) {
        console.log("Board solved!");
        updateUI(copyOfBoard);
        clearInterval(timer); // Stop the timer after solving
        alert("The puzzle has been solved!");
    } else {
        console.log("No solution exists.");
        alert("No solution exists for this puzzle.");
    }
}

// Recursive backtracking algorithm
function solve(board, r, c) {
    if (c == 9) {
        c = 0;
        r++;
        if (r == 9) return true; // Solved
    }

    if (board[r][c] != "-") return solve(board, r, c + 1);

    for (let num = 1; num <= 9; num++) {
        if (isValid(board, r, c, num.toString())) {
            board[r][c] = num.toString(); // Set the number

            if (solve(board, r, c + 1)) return true; // Continue to solve recursively

            board[r][c] = "-"; // Reset if not valid
        }
    }

    return false; // No valid number found
}

// Check if the placement is valid
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false; // Check row and column
    }
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] === num) return false; // Check 3x3 square
        }
    }
    return true; // Valid placement
}

// Update UI with solved numbers
function updateUI(solvedBoard) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile && solvedBoard[r][c] !== "-") {
                tile.innerText = solvedBoard[r][c];
                tile.classList.add("tile-solved"); // Add class to indicate solved tile
            }
        }
    }
}

function checkIfSolved() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (currentGame.solution[r][c] !== document.getElementById(r.toString() + "-" + c.toString()).innerText) {
                return false; // Return false if not solved
            }
        }
    }
    return true; // Return true if solved
}

function resetGame() {
    document.getElementById("board").innerHTML = ""; // Clear the board
    document.getElementById("digits").innerHTML = ""; // Clear the numbers
    numSelected = null; // Reset selected number
    seconds = 0; // Reset timer
    clearInterval(timer); // Clear timer
    gameStarted = false; // Reset game started status
    setGame(); // Restart the game
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll('.tile').forEach(tile => tile.classList.toggle('dark-mode'));
    document.querySelectorAll('.number').forEach(number => number.classList.toggle('dark-mode'));
}
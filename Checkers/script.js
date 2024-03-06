let board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
];

let selectedPiece = null;

// Function to build the checkers board
function buildBoard() {
    const checkersBoard = document.getElementById('checkers-board');
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const square = document.createElement('div');
            square.id = `square-${i}-${j}`;
            square.classList.add((i + j) % 2 === 0 ? 'red' : 'black');
            square.addEventListener('click', () => selectOrMovePiece(i, j));
            if (board[i][j] === 1) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'red-piece');
                square.appendChild(piece);
            } else if (board[i][j] === -1) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'black-piece');
                square.appendChild(piece);
            }
            checkersBoard.appendChild(square);
        }
    }
}

let currentPlayer = 1;  // Start with player 1 (red)

// Function to handle piece selection and movement
function selectOrMovePiece(i, j) {
    if ((i + j) % 2 !== 0) {  // Ensures that pieces are only moved to black squares
        if (selectedPiece) {
            // Ensures that pieces are only moved one square at a time or capture an opponent's piece
            if (Math.abs(selectedPiece.i - i) === 1 && Math.abs(selectedPiece.j - j) === 1 && board[i][j] === 0) {
                movePiece(i, j);
                switchPlayer();
            } else if (Math.abs(selectedPiece.i - i) === 2 && Math.abs(selectedPiece.j - j) === 2) {
                const middleI = (selectedPiece.i + i) / 2;
                const middleJ = (selectedPiece.j + j) / 2;
                if (board[middleI][middleJ] !== 0 && board[middleI][middleJ] !== board[selectedPiece.i][selectedPiece.j] && board[i][j] === 0) {
                    const capturedSquare = document.getElementById(`square-${middleI}-${middleJ}`);
                    const capturedPiece = capturedSquare.firstChild;
                    capturedSquare.removeChild(capturedPiece);  // Remove the captured piece from the board
                    board[middleI][middleJ] = 0;  // Remove the captured piece from the board array
                    movePiece(i, j);
                    switchPlayer();
                }
            }
        } else if (board[i][j] === currentPlayer) {
            selectedPiece = { i, j };
        }
    }
}

// Function to switch between players
function switchPlayer() {
    currentPlayer = -currentPlayer;  // Switch between 1 and -1
}

// Function to move a piece
function movePiece(i, j) {
    const oldSquare = document.getElementById(`square-${selectedPiece.i}-${selectedPiece.j}`);
    const piece = oldSquare.firstChild;
    oldSquare.removeChild(piece);

    const newSquare = document.getElementById(`square-${i}-${j}`);
    newSquare.appendChild(piece);

    // Update the board array
    board[selectedPiece.i][selectedPiece.j] = 0;
    board[i][j] = piece.classList.contains('red-piece') ? 1 : -1;

    selectedPiece = null;
    updateScoreboard();
}

let gameOver = false;

// Function to handle the game over message
function gameOverMessage(winner) {
    const message = `${winner === 1 ? 'Red' : 'Black'} player won! Press any key to play again.`;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('myModal').style.display = 'block';
    
    // Add event listener for keydown event
    document.addEventListener('keydown', resetBoard);
}

// Function to reset the board
function resetBoard() {
    // Reset the board array to its initial state
    board = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [-1, 0, -1, 0, -1, 0, -1, 0],
        [0, -1, 0, -1, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0, -1, 0],
    ];

    // Clear the checkers board
    const checkersBoard = document.getElementById('checkers-board');
    checkersBoard.innerHTML = '';

    // Rebuild the board
    buildBoard();

    // Hide the modal
    document.getElementById('myModal').style.display = 'none';

    // Remove the event listener to prevent multiple bindings
    document.removeEventListener('keydown', resetBoard);
}

// Function to update the scoreboard
function updateScoreboard() {
    let redScore = 0;
    let blackScore = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                redScore++;
            } else if (board[i][j] === -1) {
                blackScore++;
            }
        }
    }
    document.getElementById('red-score').textContent = `Red pieces remaining: ${redScore}`;
    document.getElementById('black-score').textContent = `Black pieces remaining: ${blackScore}`;

    // Check if one player has no pieces remaining
    if (redScore === 0 && !gameOver) {
        gameOver = true;
        gameOverMessage(-1);
    } else if (blackScore === 0 && !gameOver) {
        gameOver = true;
        gameOverMessage(1);
    }
}

// Initial setup
buildBoard();

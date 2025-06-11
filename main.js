function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r].push(Cell());
        }
    }

    const getBoard = () => board;
    const getRows = () => rows;
    const getColumns = () => columns;

    const placeMarker = (row, column, player) => {
        // invalid move, immediately return
        if (board[row][column].getValue() !== 0) return 'invalid'
        board[row][column].addMarker(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
        return {}
    }

    return {getBoard, placeMarker, printBoard, getRows, getColumns}
}

function Cell() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addMarker, getValue}
}

function GameController(playerOneName = 'Player One', playerTwoName = 'Player Two') {
    const board = Gameboard();
    const players = [{name: playerOneName, marker: 'x'}, {name: playerTwoName, marker: 'o'}];
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    const checkWinner = () => {
        // check each row
        for (let r = 0; r < board.getRows(); r++) {
            if (board.getBoard()[r][0].getValue() === board.getBoard()[r][1].getValue() && 
                board.getBoard()[r][1].getValue() === board.getBoard()[r][2].getValue() && board.getBoard()[r][0].getValue()) {
                    return getActivePlayer().name;
                }
        }
        // check each column
        for (let c = 0; c < board.getColumns(); c++) {
            if (board.getBoard()[0][c].getValue() === board.getBoard()[1][c].getValue() && 
                board.getBoard()[1][c].getValue() === board.getBoard()[2][c].getValue() && board.getBoard()[0][c].getValue()) {
                    return getActivePlayer().name;
                }
        }
        // check diagonals
        if (board.getBoard()[0][0].getValue() === board.getBoard()[1][1].getValue() && 
            board.getBoard()[1][1].getValue() === board.getBoard()[2][2].getValue() && board.getBoard()[0][0].getValue()) {
            return getActivePlayer().name;
        } 
        if (board.getBoard()[0][2].getValue() === board.getBoard()[1][1].getValue() && 
            board.getBoard()[1][1].getValue() === board.getBoard()[2][0].getValue() && board.getBoard()[0][2].getValue()) {
            return getActivePlayer().name;
        } 
    }

    const playRound = (row, column) => {
        // console.log(`Dropping ${getActivePlayer().name}'s marker into row ${row}, column ${column}...`)
        const invalid = board.placeMarker(row, column, getActivePlayer().marker);
        if (invalid) {
            return;
        }
        const winner = checkWinner();
        if (winner) {
            return winner;
        }
        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {playRound, getActivePlayer, getBoard: board.getBoard}
}

function ScreenController() {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const restartButtons = document.querySelectorAll('.restart');
    const messageDiv = document.querySelector('.message');
    const winnerText = document.querySelector('.winnerText');
    const overlay = document.querySelector('.overlay');
    const playButton = document.querySelector('.play');
    const form = document.querySelector('form');
    const player1 = document.querySelector('#player1');
    const player2 = document.querySelector('#player2');

    let game;

    const updateScreen = () => {
        boardDiv.textContent = '';
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        board.forEach((row, r) => {
            row.forEach((cell, c) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.row = r;
                cellButton.dataset.column = c;
                cellButton.textContent = cell.getValue() ? cell.getValue() : '';
                boardDiv.appendChild(cellButton)
            })
        });
    }

    boardDiv.addEventListener('click', event => {
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;
        if (!selectedRow || !selectedColumn) return;

        let winner = game.playRound(selectedRow, selectedColumn);
        if (winner) {
            winnerText.textContent = `${winner} wins!`;
            overlay.style.display = 'flex';
        }
        updateScreen();
    });

    restartButtons.forEach(button => {
        button.addEventListener('click', () => {
            game = GameController();
            overlay.style.display = 'none';
            winnerText.textContent = ''
            form.style.display = 'flex';
            updateScreen();
        });
    });

    playButton.addEventListener('click', (event) => {
        event.preventDefault();
        const player1Name = player1.value;
        const player2Name = player2.value;
        game = GameController(player1Name, player2Name);
        form.style.display = 'none';
        playerTurnDiv.style.display = 'flex';
        updateScreen();
    });

}

ScreenController();


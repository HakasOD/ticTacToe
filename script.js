const GameBoard = (function(){
    const row = 3;
    const column = 3;
    const board = [];

    const initiliseBoard = () => {
        for(let i = 0; i < row; i++){
            board[i] = [];
            
            for(let j = 0; j < column; j++){
                board[i].push(Cell());
            }
        }
    }

    initiliseBoard();

    const getNumberOfRows = () => row;
    
    const getNumberOfColumns = () => column;

    const getBoard = () => board;

    const getCell = (row, column) => board[row][column];

    const isOccupiedCell = (row, column) => board[row][column].isOccupied();
  

    const printBoard = () => {
       const boardWithValues = board.map((row) => row.map((cell) => cell.getOccupyingPlayer().value));
       console.log(boardWithValues);
    }

    const occupyCell = (row, column, player) => {
        board[row][column].setOccupyingPlayer(player);
    }

    return {
        getBoard,
        occupyCell,
        printBoard,
        getNumberOfColumns,
        getNumberOfRows,
        initiliseBoard,
        getCell,
        isOccupiedCell};
})();

function Cell(){
    let occupyingPlayer = "";

    const getOccupyingPlayer = () => occupyingPlayer;

    const setOccupyingPlayer = (player) => {
        occupyingPlayer = player;
    }

    const isOccupied = () => occupyingPlayer !== "";

    return {
        getOccupyingPlayer,
        setOccupyingPlayer,
        isOccupied    
    };
}

function Player(name, value){
    return {name, value};
}

function GameController(player1name = "player1", player2name = "player2"){
    const players = [
        Player(player1name, "x"),
        Player(player2name, "o")
    ];

    const Score = (function(){
        let player1Score = 0;
        let player2Score = 0;

        const resetScore = () => {
            player1Score = 0;
            player2Score = 0;
        }
        const incrementPlayer1Score = () => player1Score++;
        const incrementPlayer2Score = () => player2Score++;
        const getPlayer1Score = () => player1Score;
        const getPlayer2Score = () => player2Score;

        return {
            incrementPlayer1Score,
            incrementPlayer2Score,
            getPlayer1Score,
            getPlayer2Score,
            resetScore
        }
    })();

    let winner = null;
    let activePlayer = players[0];

    const getBoard = () => GameBoard.getBoard();

    const getActivePlayer = () => activePlayer;

    const getWinner = () => winner;

    const switchActivePlayer = () => {
        activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];
    };

    const printRound = () => {
        console.log(`It is ${activePlayer.name}'s turn: `);
        console.log(GameBoard.printBoard());
    };

    const printWinner = () => {
        console.log(`${winner.name} wins!`);
        console.log(`Score: ${Score.getPlayer1Score()} vs ${Score.getPlayer2Score()}`);
    }

    const playRound = (row, column) => {
        // Get valid move
        if (!validateMove(row, column)) return;

        GameBoard.occupyCell(row, column, activePlayer);  

        if(isGameOver()){
            winner === players[0] ? Score.incrementPlayer1Score() : Score.incrementPlayer2Score();
            printWinner();
            newGame();
        }

        switchActivePlayer();   
      
        printRound();
    };

    const playGame = () => {
        do {
            let row = prompt("Enter row");
            let column = prompt("Enter column");
            playRound(row, column);
        } while (!isGameOver());
    }

    const newGame = () => {
        GameBoard.initiliseBoard();
    }

    const resetGame = () => {
        GameBoard.initiliseBoard();
        Score.resetScore();
    }

    const validateRow = (row) => {
        return 0 <= row && row < GameBoard.getNumberOfRows();
    }

    const validateColumn = (column) => {
        return 0 <= column && column < GameBoard.getNumberOfColumns();
    }

    const validateMove = (row, column) => {

        if (!validateRow(row)) return false;
        if (!validateColumn(column)) return false;
        if (GameBoard.isOccupiedCell(row, column)) return false;

        return true;
    }

    const checkVerticalWinCondition = () => {
        let isWinConditionSatisfied = false;

        const numberOfRows = GameBoard.getNumberOfRows();
        const numberOfColumns = GameBoard.getNumberOfColumns();
        const board = GameBoard.getBoard();

        for(let column = 0; column < numberOfColumns; column++){
            let occupyingPlayers = [];

            for(let row = 0; row < numberOfRows; row++){
                occupyingPlayers.push(board[row][column].getOccupyingPlayer());
            }

            if(occupyingPlayers[0] !== "" && 
                occupyingPlayers.every(player => player === occupyingPlayers[0])){

                isWinConditionSatisfied = true;
                winner = occupyingPlayers[0];
                break;
            }
        }

        return isWinConditionSatisfied;
    }

    const checkHorizontalWinCondition = () => {
        let isWinConditionSatisfied = false;

        const numberOfRows = GameBoard.getNumberOfRows();
        const board = GameBoard.getBoard();

        for(let row = 0; row < numberOfRows; row++){    //Refacor if's
          
            if(board[row][0].getOccupyingPlayer() !== "" &&
                board[row].every(cell => cell.getOccupyingPlayer() === board[row][0].getOccupyingPlayer())) {
                
                isWinConditionSatisfied = true;
                winner = board[row][0].getOccupyingPlayer();
                break;          
            }
        }

        return isWinConditionSatisfied;
    }

    const checkDiagonalWinCondition = () => {
        const board = GameBoard.getBoard();
        const numberOfColumns = GameBoard.getNumberOfColumns();
        const numberOfRows = GameBoard.getNumberOfRows();

        let topToBottomOccupyingPlayers = [];
        let bottomToTopOccupyingPlayers = [];
        for(let i = 0; i < numberOfRows; i++){
            for (let j = 0; j < numberOfColumns; j++){
                
                if(i === j) {
                    topToBottomOccupyingPlayers.push(board[i][j].getOccupyingPlayer());

                    //Check bottom to top diagonal 
                    let negitiveRow = -i - 1;
                    bottomToTopOccupyingPlayers.push(board.at(negitiveRow)[j].getOccupyingPlayer());
                }
                
            }
        }

        let isWinConditionSatisfied = false;
        if(topToBottomOccupyingPlayers[0] !== "" &&
            topToBottomOccupyingPlayers.every(player => player === topToBottomOccupyingPlayers[0])){

            winner = topToBottomOccupyingPlayers[0];
            isWinConditionSatisfied = true;
        }

        if(bottomToTopOccupyingPlayers[0] !== "" &&
            bottomToTopOccupyingPlayers.every(player => player === bottomToTopOccupyingPlayers[0])){
            
            winner = bottomToTopOccupyingPlayers[0];
            isWinConditionSatisfied = true;
        }
 
        return isWinConditionSatisfied;
    }

    const isGameOver = () => {
        return  checkVerticalWinCondition() ||
                checkDiagonalWinCondition() ||
                checkHorizontalWinCondition();
    };


    return {  
        getWinner,
        playRound,
        isGameOver, 
        getActivePlayer,
        playGame,
        getBoard
        }
}

const ScreenController = (function(){
    const game = GameController();
    
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateDisplay = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Clear Board
        boardDiv.textContent = "";

        playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                let cellValue = " "
                if (cell.getOccupyingPlayer() !== ""){
                    cellValue = cell.getOccupyingPlayer().value;
                }

                // create cell button
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.dataset.row = rowIndex;
                cellBtn.dataset.column = columnIndex;
                cellBtn.textContent = cellValue;

                boardDiv.appendChild(cellBtn);
            })
        })
    }

    function clickHandlerBoard(e){
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow) return;
        if (!selectedColumn) return;
        
        game.playRound(selectedRow, selectedColumn);
        updateDisplay();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateDisplay();

})();


// TODO: Draw function
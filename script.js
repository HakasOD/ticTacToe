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

function GameController(){
    const players = [
        Player("Player 1", "x"),
        Player("Player 2", "o")
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
    let startingPlayer = players[0];

    const setPlayerNames = (player1name, player2name) => {
        player1name === "" ? players[0].name = "player 1" : players[0].name = player1name;
        player2name === "" ? players[1].name = "player 2" : players[1].name = player2name;
    }

    const getBoard = () => GameBoard.getBoard();

    const getActivePlayer = () => activePlayer;

    const getWinner = () => winner;

    const switchActivePlayer = () => {
        activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];
    };

    const switchStartingPlayer = () => {
        startingPlayer === players[0] ? startingPlayer = players[1] : startingPlayer = players[0];
    }

    const printRound = () => {
        console.log(`It is ${activePlayer.name}'s turn: `);
        GameBoard.printBoard();
    };

    const printWinner = () => {
        console.log(`${winner.name} wins!`);
        console.log(`Score: ${Score.getPlayer1Score()} vs ${Score.getPlayer2Score()}`);
    }

    const getScore = () => {
        return `Score: ${Score.getPlayer1Score()} vs ${Score.getPlayer2Score()}`
    }

    const playRound = (row, column) => {

        if (!validateMove(row, column)) return;
        GameBoard.occupyCell(row, column, activePlayer);  


        if(isGameOver()){
            if(isDraw()){
                console.log("Draw!!")
            } else{
                winner === players[0] ? Score.incrementPlayer1Score() : Score.incrementPlayer2Score();
                printWinner();
            }

        } else switchActivePlayer();

      
        printRound();
    };

    const newGame = () => {
        GameBoard.initiliseBoard();
        switchStartingPlayer();
        activePlayer = startingPlayer;
    }

    const resetGame = () => {
        GameBoard.initiliseBoard();
        Score.resetScore();
        activePlayer = players[0];
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

    const isDraw = () => {
        //Every cell occupied = draw
        let board = GameBoard.getBoard();

        for(let row = 0; row < GameBoard.getNumberOfRows(); row++){
            for(let column = 0; column < GameBoard.getNumberOfColumns(); column++){
                if(!board[row][column].isOccupied()){
                    return false;
                }
            }
        }

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
                checkHorizontalWinCondition() ||
                isDraw();
    };


    return {  
        getWinner,
        playRound,
        isGameOver, 
        getActivePlayer,
        getBoard,
        getScore,
        newGame,
        isDraw,
        setPlayerNames
        }
}

const ScreenController = (function(){
    const game = GameController();
    
    const player1NameInput = document.querySelector("#player1-name");
    const player2NameInput = document.querySelector("#player2-name");
    const gameDiv = document.querySelector(".game");
    const playerTurnH2 = document.querySelector(".turn");
    const scoreH2 = document.querySelector(".score");
    const boardDiv = document.querySelector(".board");
    const gameOverMessage = document.querySelector(".game-over-text");
    const menuDiv = document.querySelector(".menu");
    const startBtn = document.querySelector("#start-button");
    const restartBtn = document.querySelector(".restart-button");



    const updateDisplay = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        boardDiv.textContent = "";
        playerTurnH2.textContent = `${activePlayer.name}'s turn`;
        scoreH2.textContent = game.getScore();

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                let cellValue = " ";
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

        onGameOver();
    }

    function setPlayerNamesFromUserInput(){
        const player1name = player1NameInput.value;
        const player2name = player2NameInput.value;
        
        game.setPlayerNames(player1name, player2name);
        updateDisplay();
    }

    startBtn.addEventListener("click", setPlayerNamesFromUserInput);

    function onGameOver(){
        if(game.isGameOver()){
            gameOverMessage.classList.toggle("hide");

            if(game.isDraw()){
                gameOverMessage.textContent = "Draw!";
            } else {
                gameOverMessage.textContent = `${game.getWinner().name} wins!`;
            }

            game.newGame();
        }
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

    

    function clickHandlerGameOverMessage(){
        gameOverMessage.classList.toggle("hide");
        updateDisplay();
    }
    gameOverMessage.addEventListener("click", clickHandlerGameOverMessage);


    function toggleMenuAndGame(){
        menuDiv.classList.toggle("hide");
        gameDiv.classList.toggle("hide");
    }
    startBtn.addEventListener("click", toggleMenuAndGame);
    restartBtn.addEventListener("click", toggleMenuAndGame);

    

    menuDiv.classList.toggle("hide");
    updateDisplay();

})();

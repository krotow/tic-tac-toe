const DefaultOptions = {
    fieldColumns: 3,
    fieldRows: 3,
    playerNameX: 'Krustiņš',
    playerNameO: 'Nullīte',
    fieldLimitMin: 2,
    fieldLimitMax: 10
}

const PlayerMark = {
    X: 'X',
    O: 'O',
    BLANK: ' '
}

const GameState = {
    New: 0,
    Begin: 1,
    Turn: 2,
    Finished: 3
}

const FinishType = {
    None: 0,
    Win: 1,
    Draw: 2 
}

let moveTimer = null;
let turnStartTime = 0;

let gameState = null;

function showError( message ) {
    console.log( message );
    alert( message );
}

function startTimer( fn ) {
    stopTimer();
    moveTimer = window.setInterval( fn, 1000 );
}

function stopTimer() {
    if ( moveTimer != null ) {
        clearTimeout( moveTimer );
        moveTimer = null;
    }
}

function getFormatedTime( timeDiff ) {
    let minutes = Math.floor( timeDiff / 60 );
    let seconds = Math.floor( timeDiff % 60 );
    return minutes.toString().padStart( 2, '0' ) + ':' + seconds.toString().padStart( 2, '0' );
}

function getDocElemById( id ) {
    let el = document.getElementById( id );
    if ( el == null ) {
        showError( 'getDocElemById: ' + id + ' is not created' );
    }
    return el;
}

function getInputTextById( id ) {
    let el = getDocElemById( id );
    return ( el == null ) ? null : el.value;
}

function setInputTextById( id, value ) {
    let el = getDocElemById( id );
    if ( el != null ) {
        el.value = value;
    }
}

function hideDocElemById( id ) {
    let el = getDocElemById( id );
    if ( el != null ) {
        el.style.display = 'none';
    }   
}

function showDocElemById( id ) {
    let el = getDocElemById( id );
    if ( el != null ) {
        el.style.display = '';
    }   
}

function removeAllChildNodes( parent ) {
    while ( parent.firstChild ) {
        parent.removeChild( parent.firstChild );
    }
}

function setElemClass( elem, className ) {
    let classNames = new Set( elem.className.split( ' ' ) );
    if ( !classNames.has( className ) ) {
        classNames.add( className );
        elem.className = Array.from( classNames ).join( ' ' ).trim();
    }
}

function removeElemClass( elem, className ) {
    let classNames = new Set( elem.className.split( ' ' ) );
    if ( classNames.has( className ) ) {
        classNames.delete( className );
        elem.className = Array.from( classNames ).join( ' ' ).trim();
    }
}

function clearInputErrors() {
    const inputIds = [ 'columns', 'rows', 'win-length', 'player-x', 'player-o' ];
    inputIds.forEach( function( id ) {
        let elem = getDocElemById( id );
        removeElemClass( elem, 'error' );
    } );
}

function setInputErrorById( id ) {
    let input = getDocElemById( id );
    setElemClass( input, 'error' );
    input.focus();
}

function getGrid() {
    return getDocElemById( 'grid' );
}

function validateInput() {
    clearInputErrors();

    let columns = parseInt( getInputTextById( 'columns' ) );
    if ( isNaN( columns ) ) {
        setInputErrorById( 'columns' );
        alert( 'Kolonnu skaitu norāda kā skaitli.' );
        return false;
    }
    if ( ( columns < DefaultOptions.fieldLimitMin ) || ( columns > DefaultOptions.fieldLimitMax ) ) {
        setInputErrorById( 'columns' );
        alert( 'Atļautais kolonu skaits - no ' + DefaultOptions.fieldLimitMin + ' līdz ' + DefaultOptions.fieldLimitMax + '.' );
        return false;
    }

    let rows = parseInt( getInputTextById( 'rows' ) );
    if ( isNaN( rows ) ) {
        setInputErrorById( 'rows' );
        alert( 'Rindu skaitu norāda kā skaitli.' );
        return false;
    }
    if ( ( rows < DefaultOptions.fieldLimitMin ) || ( rows > DefaultOptions.fieldLimitMax ) ) {
        setInputErrorById( 'rows' );
        alert( 'Atļautais rindu skaits - no ' + DefaultOptions.fieldLimitMin + ' līdz ' + DefaultOptions.fieldLimitMax + '.' );
        return false;
    }

    let winLength = parseInt( getInputTextById( 'win-length' ) );
    if ( isNaN( winLength ) ) {
        setInputErrorById( 'win-length' );
        alert( 'Uzvaras virknes garumu norāda kā skaitli.' );
        return false;
    }
    let diagonalLength = Math.min( columns, rows );
    if ( ( winLength < 2 ) || ( winLength > diagonalLength ) ) {
        setInputErrorById( 'win-length' );
        alert( 'Iespējamais uzvaras virknes garums - no 2 līdz ' + diagonalLength + '.' );
        return false;
    }

    let playerX = getInputTextById( 'player-x' );
    if ( playerX == null || playerX == '' ) {
        setInputErrorById( 'player-x' );
        alert( 'Ievadiet spēlētāja X vārdu.' );
        return false;
    }

    let playerO = getInputTextById( 'player-o' );
    if ( playerO == null || playerO == '' ) {
        setInputErrorById( 'player-o' );
        alert( 'Ievadiet spēlētāja O vārdu.' );
        return false;
    }

    gameState.fieldColumns = columns;
    gameState.fieldRows = rows;
    gameState.requiredWinLength = winLength;
    gameState.playerX.name = playerX;
    gameState.playerO.name = playerO;

    return true;
}

function setGameInfoMessage( message ) {
    getDocElemById( 'info' ).textContent = message;
}

function drawGameField() {
    let grid = getGrid();
    removeAllChildNodes( grid );

    grid.style.gridTemplateColumns = 'repeat(' + gameState.fieldColumns + ', 3em)';
    grid.style.gridTemplateRows = 'repeat(' + gameState.fieldRows + ', 3em)';

    for( let r = 0; r < gameState.fieldRows; r++ ) {
        for( let c = 0; c < gameState.fieldColumns; c++ ) {
            let el = document.createElement( 'div' );
            el.setAttribute( 'id', 'r' + r + 'c' + c );
            el.textContent = ( ( r * gameState.fieldColumns ) + c + 1 ).toString();
            grid.appendChild( el );

            el.addEventListener( 'click', function() {
                onCellClick( this );
            } );
        }
    }
}

function setGameState( state ) {
    gameState.state = state;
    switch( state ) {
        case GameState.New:
            onNewGame();
            break;
        case GameState.Begin:
            onBeginGame();
            break;
        case GameState.Turn:
            onTurn();
            break;
        case GameState.Finished:
            onFinishGame();
            break;
    }
}

function resetGame() {
    gameState = {
        fieldColumns: DefaultOptions.fieldColumns,
        fieldRows: DefaultOptions.fieldRows,
        requiredWinLength: Math.min( DefaultOptions.fieldColumns, DefaultOptions.fieldRows ),
        playerX: {
            name: DefaultOptions.playerNameX,
            mark: PlayerMark.X,
            wins: 0
        },
        playerO: {
            name: DefaultOptions.playerNameO,
            mark: PlayerMark.O,
            wins: 0
        },
        firstPlayer: PlayerMark.X,
        currentPlayer: null,
        field: null,
        history: [],
        round: 0,
        state: null,
        endState: {
            finishType: FinishType.None,
            winPositions: null,
        }
    };
    setGameState( GameState.New );
}

function onNewGame() {
    showDocElemById( 'button-reset' );
    showDocElemById( 'button-begin' );
    hideDocElemById( 'button-continue' );
    hideDocElemById( 'button-new' );
    hideDocElemById( 'game-first-player' );
    hideDocElemById( 'game-field' );
    showDocElemById( 'game-options' );
    setInputTextById( 'columns', gameState.fieldColumns );
    setInputTextById( 'rows', gameState.fieldRows );
    setInputTextById( 'win-length', gameState.requiredWinLength );
    setInputTextById( 'player-x', gameState.playerX.name );
    setInputTextById( 'player-o', gameState.playerO.name );
}

function onBeginGame() {
    gameState.fieldColumns = parseInt( getInputTextById( 'columns' ) );
    gameState.fieldRows = parseInt( getInputTextById( 'rows' ) );
    gameState.requiredWinLength = parseInt( getInputTextById( 'win-length' ) );
    gameState.playerX.name = getInputTextById( 'player-x' );
    gameState.playerO.name = getInputTextById( 'player-o' );
    gameState.currentPlayer = null;
    gameState.round = 0;
    gameState.playerX.wins = 0;
    gameState.playerO.wins = 0;

    hideDocElemById( 'button-reset' );
    hideDocElemById( 'button-begin' );
    hideDocElemById( 'button-continue' );
    showDocElemById( 'button-new' );

    hideDocElemById( 'game-options' );

    getDocElemById( 'button-first-x' ).textContent = gameState.playerX.name + ' (X)'
    getDocElemById( 'button-first-o' ).textContent = gameState.playerO.name + ' (O)'
    showDocElemById( 'game-first-player' );
}

function onTurn() {
    turnStartTime = new Date();
    startTimer( function() { 
        let currentTime = new Date();
        let elapsedSecs = ( currentTime - turnStartTime ) / 1000;
        getDocElemById( 'elapsed-time' ).textContent = getFormatedTime( elapsedSecs );
    } );

    if ( gameState.currentPlayer == PlayerMark.X ) {
        setGameInfoMessage( 'Spēlētāja ' + gameState.playerX.name + ' gājiens.' );
    } else {
        setGameInfoMessage( 'Spēlētāja ' + gameState.playerO.name + ' gājiens.' );
    }
}

function onFinishGame() {
    stopTimer();
    hideDocElemById( 'button-begin' );
    showDocElemById( 'button-continue' );
    showDocElemById( 'button-new' );

    switch( gameState.endState.finishType ) {
        case FinishType.Win:
            if ( gameState.currentPlayer == PlayerMark.X ) {
                gameState.playerX.wins++;
                setGameInfoMessage( 'Uzvarēja ' + gameState.playerX.name + '.' );
            } else {
                gameState.playerO.wins++;
                setGameInfoMessage( 'Uzvarēja ' + gameState.playerO.name + '.' );
            }
            updateRoundHeader();
            showWin();
            break;
        case FinishType.Draw:
            setGameInfoMessage( 'Raunds beidzās neizšķirti.' );
            break;
    }

    // Swap players for next turn
    if ( gameState.firstPlayer == PlayerMark.X ) {
        gameState.firstPlayer = PlayerMark.O;
    } else {
        gameState.firstPlayer = PlayerMark.X;
    }
}

function onCellClick( el ) {
    if ( gameState.state == GameState.Finished ) {
        return;
    }

    let id = el.getAttribute( 'id' );
    let pos = id.match( /(?:[r])(?<row>\d+)(?:[c])(?<column>\d+)/ );
    if ( pos == null ) {
        showError( 'Neatbilstošs rūtiņas id \'' + id + '\'.' );
        return;
    }

    let row = pos.groups.row;
    let column = pos.groups.column;
    console.log( 'Selected: row=' + row + ', col=' + column );

    // Skip used cells
    if ( gameState.field[ row ][ column ] != PlayerMark.BLANK ) {
        return;
    }

    el.style.cursor = 'not-allowed'; // visual used cell indicator
    gameState.field[ row ][ column ] = gameState.currentPlayer;
    gameState.history.push( { 'row':row, 'column':column, 'player':gameState.currentPlayer } );

    if ( gameState.currentPlayer == PlayerMark.X ) {
        el.className = 'player-x';
        el.textContent = gameState.playerX.mark;
    } else {
        el.className = 'player-o';
        el.textContent = gameState.playerO.mark;
    }

    if ( isWinner( gameState.currentPlayer ) ) {
        gameState.endState.finishType = FinishType.Win;
    } else if ( !hasAvailableTurns() ) {
        gameState.endState.finishType = FinishType.Draw;
    }

    // Stop here if game is finished
    if ( gameState.endState.finishType != FinishType.None ) {
        setGameState( GameState.Finished );
        return;
    }

    nextTurn();
}

function updateRoundHeader() {
    getDocElemById( 'round-number' ).textContent = gameState.round;
    getDocElemById( 'player-name-x' ).textContent = gameState.playerX.name + ':';
    getDocElemById( 'player-x-wins' ).textContent = gameState.playerX.wins;
    getDocElemById( 'player-name-o' ).textContent = gameState.playerO.name + ':';
    getDocElemById( 'player-o-wins' ).textContent = gameState.playerO.wins;
}

function newRound() {
    hideDocElemById( 'button-begin' );
    hideDocElemById( 'button-continue' );
    showDocElemById( 'button-new' );
    hideDocElemById( 'game-first-player' );
    showDocElemById( 'game-field' );

    resetWinnerState();
    gameState.currentPlayer = gameState.firstPlayer;

    // Update round info
    gameState.round++;
    updateRoundHeader();

    // Redraw game field
    gameState.field = Array.from( Array( gameState.fieldRows ), () => Array( gameState.fieldColumns ).fill( PlayerMark.BLANK ) );
    drawGameField();

    setGameState( GameState.Turn );
}

function nextTurn() {
    if ( gameState.currentPlayer == PlayerMark.X ) {
        gameState.currentPlayer = PlayerMark.O;
    } else {
        gameState.currentPlayer = PlayerMark.X;
    }

    setGameState( GameState.Turn );
}

function hasAvailableTurns() {
    let result = gameState.field.some( function( row ) {
        return row.includes( PlayerMark.BLANK );
    } );
    return result;
}

function isWinner( playerMark ) {
    const arrayRow = ( arr, n ) => arr[ n ];
    const arrayColumn = ( arr, n ) => arr.map( x => x[ n ] );

    // Check win by row
    for ( let i = 0; i < gameState.fieldRows; i++ ) {
        const cells = arrayRow( gameState.field, i );
        let cellPositions = [];
        for ( let j = 0; j < gameState.fieldColumns; j++ ) {
            if ( cells[ j ] == playerMark ) {
                cellPositions.push( { row: i, column: j } );
            } else {
                // Winning length reached before other gamer mark
                if ( cellPositions.length >= gameState.requiredWinLength ) {
                    setWinnerState( cellPositions );
                    return true;
                }
                cellPositions.length = 0;
            }
        }
        if ( cellPositions.length >= gameState.requiredWinLength ) {
            setWinnerState( cellPositions );
            return true;
        }
    }

    // Check win by column
    for ( let i = 0; i < gameState.fieldColumns; i++ ) {
        const cells = arrayColumn( gameState.field, i );
        let cellPositions = [];
        for ( let j = 0; j < gameState.fieldRows; j++ ) {
            if ( cells[ j ] == playerMark ) {
                cellPositions.push( { row: j, column: i } );
            } else {
                // Winning length reached before other gamer mark
                if ( cellPositions.length >= gameState.requiredWinLength ) {
                    setWinnerState( cellPositions );
                    return true;
                }
                cellPositions.length = 0;
            }
        }
        if ( cellPositions.length >= gameState.requiredWinLength ) {
            setWinnerState( cellPositions );
            return true;
        }
    }

    //
    // Check win diagonally
    //

    // Determine count and direction of validation squares
    const rowSquares = gameState.fieldRows - gameState.requiredWinLength + 1;       // vertical movement
    const columnSquares = gameState.fieldColumns - gameState.requiredWinLength + 1; // horizontal movement
    // According to longest field side slide "square" window over game field
    // horizontally or vertically. Check square diagonal win condition by
    // direct or reverse diagonal in each square
    for ( let rPos = 0; rPos < rowSquares; rPos++ ) {
        for ( let cPos = 0; cPos < columnSquares; cPos++ ) {
            let directDiagonal = {
                cells: [],
                positions: []
            }
            let reverseDiagonal = {
                cells: [],
                positions: []
            }
            for ( let i = 0; i < gameState.requiredWinLength; i++ ) {
                let directRow = rPos + i;
                let reverseRow = rPos + gameState.requiredWinLength - i - 1;
                let column = cPos + i;
                directDiagonal.cells.push( gameState.field[ directRow ][ column ] );
                directDiagonal.positions.push( { row: directRow, 'column': column } );
                reverseDiagonal.cells.push( gameState.field[ reverseRow ][ column ] );
                reverseDiagonal.positions.push( { row: reverseRow, 'column': column } );
            }
            // Win by direct diagonal
            let cellPositions = [];

            for ( let i = 0; i < directDiagonal.cells.length; i++ ) {
                if ( directDiagonal.cells[ i ] == playerMark ) {
                    let pos = directDiagonal.positions[ i ];
                    cellPositions.push( { row: pos.row, column: pos.column } );
                } else {
                    // Winning length reached before other gamer mark
                    if ( cellPositions.length >= gameState.requiredWinLength ) {
                        setWinnerState( cellPositions );
                        return true;
                    }
                    cellPositions.length = 0;
                }
            }
            if ( cellPositions.length >= gameState.requiredWinLength ) {
                setWinnerState( cellPositions );
                return true;
            }

            cellPositions.length = 0;

            for ( let i = 0; i < reverseDiagonal.cells.length; i++ ) {
                if ( reverseDiagonal.cells[ i ] == playerMark ) {
                    let pos = reverseDiagonal.positions[ i ];
                    cellPositions.push( { row: pos.row, column: pos.column } );
                } else {
                    // Winning length reached before other gamer mark
                    if ( cellPositions.length >= gameState.requiredWinLength ) {
                        setWinnerState( cellPositions );
                        return true;
                    }
                    cellPositions.length = 0;
                }
            }
            if ( cellPositions.length >= gameState.requiredWinLength ) {
                setWinnerState( cellPositions );
                return true;
            }
        }
    }

    return false;
}

function resetWinnerState() {
    gameState.endState.finishType = FinishType.None;
    gameState.endState.winPositions = null;
}

function setWinnerState( winPositions ) {
    gameState.endState.finishType = FinishType.Win;
    gameState.endState.winPositions = winPositions;
}

function showWin() {
    const getCellElem = ( row, column ) => getDocElemById( 'r' + row + 'c' + column );

    gameState.endState.winPositions.forEach( function( pos ) {
        let cell = getCellElem( pos.row, pos.column );
        setElemClass( cell, 'win' );
    } );
}

// Initialize on load
window.addEventListener( 'load', resetGame );

document.getElementById( 'button-reset' ).addEventListener( 'click', function() {
    resetGame();
} );

document.getElementById( 'button-begin' ).addEventListener( 'click', function() {
    if ( validateInput() ) {
        setGameState( GameState.Begin );
    }
} );

document.getElementById( 'button-continue' ).addEventListener( 'click', function() {
    newRound();
} );

document.getElementById( 'button-new' ).addEventListener( 'click', function() {
    setGameState( GameState.New );
} );

document.getElementById( 'button-first-x' ).addEventListener( 'click', function() {
    gameState.firstPlayer = PlayerMark.X;
    newRound();
} );

document.getElementById( 'button-first-o' ).addEventListener( 'click', function() {
    gameState.firstPlayer = PlayerMark.O;
    newRound();
} );

const DefaultOptions = {
    fieldColumns: 3,
    fieldRows: 3,
    playerNameX: 'Krustiņš',
    playerNameO: 'Nullīte',
    fieldLimitMin: 2,
    fieldLimitMax: 20,
    elapsedTurnTimeout: -1
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

function getGrid() {
    return getDocElemById( 'grid' );
}

function saveSettings() {
    let columns = parseInt( getInputTextById( 'columns' ) );
    if ( isNaN( columns ) ) {
        document.getElementById( 'columns' ).focus();
        alert( 'Ievadiet kolonnas numuru kā skaitli.' );
        return;
    }
    if ( ( columns < DefaultOptions.fieldLimitMin ) || ( columns > DefaultOptions.fieldLimitMax ) ) {
        document.getElementById( 'columns' ).focus();
        alert( 'Atļautais kolonu skaits ir no ' + DefaultOptions.fieldLimitMin + ' līdz ' + DefaultOptions.fieldLimitMax + '.' );
        return;
    }

    let rows = parseInt( getInputTextById( 'rows' ) );
    if ( isNaN( rows ) ) {
        document.getElementById( 'rows' ).focus();
        alert( 'Ievadiet rindas numuru kā skaitli.' );
        return;
    }
    if ( ( rows < DefaultOptions.fieldLimitMin ) || ( rows > DefaultOptions.fieldLimitMax ) ) {
        document.getElementById( 'rows' ).focus();
        alert( 'Atļautais rindu skaits ir no ' + DefaultOptions.fieldLimitMin + ' līdz ' + DefaultOptions.fieldLimitMax + '.' );
        return;
    }
    
    let playerX = getInputTextById( 'player-x' );
    if ( playerX == null || playerX == '' ) {
        document.getElementById( 'player-x' ).focus();
        alert( 'Ievadiet spēlētāja X vārdu.' );
        return;
    }

    let playerO = getInputTextById( 'player-o' );
    if ( playerO == null || playerO == '' ) {
        document.getElementById( 'player-o' ).focus();
        alert( 'Ievadiet spēlētāja O vārdu.' );
        return;
    }

    gameState.fieldColumns = columns;
    gameState.fieldRows = rows;
    gameState.playerX.name = playerX;
    gameState.playerO.name = playerO;

    setGameState( GameState.New );
}

function setFixedTurnTime() {
    turnStartTime = new Date();
    startTimer( function() { 
        currentTime = new Date();
        let elapsedSecs = ( currentTime - turnStartTime ) / 1000;
        // on timeout switch to other player turn
        if ( elapsedSecs == gameState.turnTimeout ) {
            stopTimer();
            nextTurn();
        }
        getDocElemById( 'elapsed-time' ).textContent = getFormatedTime( elapsedSecs );
    } );
}

function setUnlimitedTurnTime() {
    turnStartTime = new Date();
    startTimer( function() { 
        currentTime = new Date();
        let elapsedSecs = ( currentTime - turnStartTime ) / 1000;
        getDocElemById( 'elapsed-time' ).textContent = getFormatedTime( elapsedSecs );
    } );
}

function setGameInfoMessage( message ) {
    getDocElemById( 'game-info' ).textContent = message;
}

function drawGameField() {
    let grid = getGrid();
    removeAllChildNodes( grid );

    grid.style.gridTemplateColumns = 'repeat(' + gameState.fieldColumns + ', 3em)';
    grid.style.gridTemplateRows = 'repeat(' + rows + ', 3em)';

    for( let r = 0; r < gameState.fieldRows; r++ ) {
        for( let c = 0; c < gameState.fieldColumns; c++ ) {
            let el = document.createElement( 'div' );
            el.setAttribute( 'id', 'r' + r + 'c' + c );
            el.textContent = ( ( r * gameState.fieldColumns ) + c + 1 ).toString();
            grid.appendChild( el );

            el.addEventListener( 'click', function( e ) {
                onCellClick( this );
            } );
        }
    }
}

function getGameState() {
    return gameState;
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
        turnTimeout: DefaultOptions.elapsedTurnTimeout,
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
    showDocElemById( 'button-begin' );
    hideDocElemById( 'button-continue' );
    hideDocElemById( 'button-new' );
    hideDocElemById( 'game-first-player' );
    hideDocElemById( 'game-field' );
    setInputTextById( 'columns', gameState.fieldColumns );
    setInputTextById( 'rows', gameState.fieldRows );
    setInputTextById( 'player-x', gameState.playerX.name );
    setInputTextById( 'player-o', gameState.playerO.name );
}

function onBeginGame() {
    gameState.fieldColumns = parseInt( getInputTextById( 'columns' ) );
    gameState.fieldRows = parseInt( getInputTextById( 'rows' ) );
    gameState.playerX.name = getInputTextById( 'player-x' );
    gameState.playerO.name = getInputTextById( 'player-o' );
    gameState.currentPlayer = null;
    gameState.round = 0;
    gameState.playerX.wins = 0;
    gameState.playerO.wins = 0;

    hideDocElemById( 'button-begin' );
    hideDocElemById( 'button-continue' );
    showDocElemById( 'button-new' );
    showDocElemById( 'game-first-player' );
}

function onTurn() {
    if ( gameState.turnTimeout == DefaultOptions.elapsedTurnTimeout ) {
        setUnlimitedTurnTime();
    } else {
        setFixedTurnTime();
    }

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
            break;
        case FinishType.Draw:
            setGameInfoMessage( 'Spēle beidzās neizšķirti.' );
            break;
    }
}

function onCellClick( el ) {
    if ( getGameState() == GameState.Finished ) {
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

    gameState.field[ row ][ column ] = gameState.currentPlayer;
    gameState.history.push( { 'row':row, 'column':column, 'player':gameState.currentPlaye } );

    if ( gameState.currentPlayer == PlayerMark.X ) {
        el.className = 'player-x';
        el.textContent = gameState.playerX.mark;
    } else {
        el.className = 'player-o';
        el.textContent = gameState.playerO.mark;
    }

    if ( !hasAvailableTurns() ) {
        gameState.endState.finishType = FinishType.Draw;
    } else if ( isWinner( gameState.currentPlayer ) ) {
        gameState.endState.finishType = FinishType.Win;
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
        let result = arrayRow( gameState.field, i ).every( e => e == playerMark );
        if ( result ) {
            setWinnerState( i, 0, i, gameState.fieldColumns - 1 );
            return true;
        }
    }

    // Check win by column
    for ( let i = 0; i < gameState.fieldColumns; i++ ) {
        let result = arrayColumn( gameState.field, i ).every( e => e == playerMark );
        if ( result ) {
            setWinnerState( 0, i, gameState.fieldRows - 1, i );
            return true;
        }
    }

    // Check win diagonally

    //TODO
  
    return false;
}

function resetWinnerState() {
    gameState.endState.finishType = FinishType.None;
    gameState.endState.winPositions = null;
}

function setWinnerState( startRow, startCol, endRow, endCol ) {
    gameState.endState.finishType = FinishType.Win;
    gameState.endState.winPositions = {
        start: [ startRow, startCol ],
        end: [ endRow, endCol ]
    };
}

// Initialize on load
window.addEventListener( 'load', resetGame );

document.getElementById( 'button-reset' ).addEventListener( 'click', function() {
    resetGame();
} );

document.getElementById( 'button-save-settings' ).addEventListener( 'click', function() {
    saveSettings();
} );

document.getElementById( 'button-new' ).addEventListener( 'click', function() {
    setGameState( GameState.New );
} );

document.getElementById( 'button-begin' ).addEventListener( 'click', function() {
    setGameState( GameState.Begin );
} );

document.getElementById( 'button-continue' ).addEventListener( 'click', function() {
    newRound();
} );

document.getElementById( 'button-first-x' ).addEventListener( 'click', function() {
    gameState.firstPlayer = PlayerMark.X;
    newRound();
} );

document.getElementById( 'button-first-o' ).addEventListener( 'click', function() {
    gameState.firstPlayer = PlayerMark.O;
    newRound();
} );

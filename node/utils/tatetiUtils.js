var WINNER_VALUES = [7, 56, 73, 84, 146, 273, 292, 448]

/*
[1  2   4   8   16  32  64  128 256]
 1  2   4                           => 7
            8   16  32              => 56
                        64  128 256 => 448
 1          8           64          => 73
    2           16          128     => 146
        4           32          256 => 292
 1              16              256 => 273
        4       16      64          => 84
*/


function isTateti(game, board, currentPlayer) {
    console.log(`Game`)
    console.log(game);
    console.log(`Current player`)
    console.log(currentPlayer);

    //antes de 5 movimientos no hay chances de que exista tateti, por eso verifico si hay ganadores a partir del 5 movmiento
    if (game.moveQty < 5) {
        return false;
    }

    var points = 0;
    for (var cell in board) {
        console.log(cell + ":" + board[cell]);
        if (board[cell] == currentPlayer.playerId) {
            points = points + Math.pow(2, parseInt(cell));
        }
    }
    console.log(`Current's player points: ${points}`);
    console.log(WINNER_VALUES.find(value => (value & points) == value));

    if (WINNER_VALUES.find(value => (value & points) == value) != undefined) {
        return true;
    }
    return false;
}

module.exports = { isTateti }
var cross = false;

function isCrossSelected(player) {
    return player.pieceSelected == 'X' ? true : false
}

function selectPiece(player) {
    if (player.pieceSelected == 'X') {
        cross = true;
    }
}

module.exports = {
    isCrossSelected,
    selectPiece,
    cross,
}
import React from 'react';
import './App.css';
import Board from './Board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: props.game.status,
            moveQty: props.game.moveQty,
            winner: props.game.winner,
        }
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board board={this.props.board} players={this.props.players} />
                </div>
            </div>
        );
    }
}

export default Game;
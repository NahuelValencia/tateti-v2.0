import React from 'react';
import './App.css';
import Board from './Board';
import axios from 'axios';

class Game extends React.Component {
    constructor(props) {
        super(props);
        console.log(`in Game`)
        console.log(props)
        this.state = {
            status: props.game.status,
            moveQty: props.game.moveQty,
            winner: props.game.winner,
        }
    }

    componentDidMount() {
        this.checkForTurn()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    checkForTurn() {
        let gameId = this.props.game.gameId
        let authorization = this.props.currentPlayer.session_token

        this.interval = setInterval(() => {
            const headers = {
                'Authorization': authorization
            }

            axios
                .get(`http://localhost:9000/game/${gameId}`, {
                    headers: headers
                })
                .then(res => {
                    console.log(res.data.response)

                })
                .catch(error => this.setState({ error, isLoading: false }));

        }, 2000)
    }


    handleMove(position) {
        console.log(`click on ${position}th cell`)
    }

    render() {
        return (
            <div>
                <div className="player">
                    <h4 >
                        {this.props.players[0].name}  {this.props.players[0].pieceSelected}
                    </h4>
                    <h4>
                        {this.props.players[1].name}  {this.props.players[1].pieceSelected}
                    </h4>
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board board={this.props.board} players={this.props.players} onClick={(i) => this.handleMove(i)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
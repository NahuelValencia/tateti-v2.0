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
            board: props.board,
            currentPlayerTurn: null
        }
    }

    componentDidMount() {
        this.checkForPlayerTurn()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    checkForPlayerTurn() {
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
                    if (res.data.status === 200) {
                        this.setState({
                            board: res.data.response.board,
                        })
                        this.clearInterval(this.interval)
                    }
                })
                .catch(error => this.setState({ error, isLoading: false }));

        }, 2000)
    }


    handleMove(position) {
        let currentPlayerId = this.props.currentPlayer.playerId
        let gameId = this.props.game.gameId
        let boardId = this.props.game.boardId
        let authorization = this.props.currentPlayer.session_token

        const headers = {
            'Authorization': authorization
        }

        const body = {
            playerId: currentPlayerId,
            position: position,
            gameId: gameId,
            boardId: boardId
        }

        axios
            .put(`http://localhost:9000/game/move`, body, {
                headers: headers
            })
            .then(res => {
                console.log("Movement")
                console.log(res.data.response)
                if (res.status === 200) {
                    this.setState({
                        board: res.data.response.board
                    })
                }
            })
            .catch(error => this.setState({ error, isLoading: false }));
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
                        <Board board={this.state.board} players={this.props.players} onClick={(i) => this.handleMove(i)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
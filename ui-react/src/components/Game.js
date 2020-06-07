import React from 'react';
import '../App.css';
import Board from './Board';
import { searchGameById, makeMovement } from '../service/GameApi'

class Game extends React.Component {
    constructor(props) {
        super(props);
        console.log(`in Game`)
        console.log(props)
        this.state = {
            gameStatus: props.game.status,
            winner: props.game.winner,
            board: props.board,
            player1: {},
            player2: {}
        }
    }

    componentDidMount() {
        this.checkForPlayerTurn()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    checkForPlayerTurn = async () => {
        let gameId = this.props.game.gameId
        let authorization = this.props.currentPlayer.session_token

        const headers = {
            'Authorization': authorization
        }

        this.interval = setInterval(async () => {
            if (this.state.gameStatus !== "Game Over") {
                try {
                    let res = await searchGameById(gameId, headers)
                    if (res.status === 200) {
                        this.setState({
                            gameStatus: res.response.status,
                            winner: res.response.winner,
                            board: res.response.board,
                            player1: res.response.players[0],
                            player2: res.response.players[1]
                        })
                    }
                    if (res.status === 400) {
                        clearInterval(this.interval)

                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                clearInterval(this.interval)
            }
        }, 2000)
    }


    handleMove = async (position) => {
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

        try {
            let res = await makeMovement(body, headers)
            if (res.status === 200) {
                console.log("Player movement")
                console.log(res)
                this.setState({
                    board: res.response.board
                })
            }
            if (res.status === 400) {
                return alert(res.response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        if (this.state.winner === "null") {
            return (
                <div>
                    <div className="player">
                        <ol>
                            <li type="circle">
                                <h3>
                                    {this.props.players[0].name} plays with '{this.props.players[0].pieceSelected}'
                            </h3>
                            </li>
                            <li type="circle">
                                <h3>
                                    {this.props.players[1].name} plays with '{this.props.players[1].pieceSelected}'
                            </h3>
                            </li>
                        </ol>
                    </div>
                    <div className="turn">
                        {this.state.player1.turn === "true" ?
                            <h2>Turn: {this.state.player1.name}</h2> :
                            <h2>Turn: {this.state.player2.name}</h2>
                        }
                    </div>
                    <div className="game">
                        <div className="game-board">
                            <Board board={this.state.board} onClick={(i) => this.handleMove(i)} />
                        </div>
                    </div>
                </div >
            )
        }
        return (
            <div>
                <h1>{this.state.winner} is the winner</h1>
            </div>
        )
    }
}

export default Game;
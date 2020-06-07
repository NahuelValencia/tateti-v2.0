import React from 'react';
import './App.css';
import Board from './Board';
import { searchGameById, makeMovement } from './service/GameApi'

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

    checkForPlayerTurn = async () => {
        let gameId = this.props.game.gameId
        let authorization = this.props.currentPlayer.session_token

        const headers = {
            'Authorization': authorization
        }

        this.interval = setInterval(async () => {

            try {
                let res = await searchGameById(gameId, headers)
                if (res.status === 200) {
                    this.setState({
                        board: res.response.board,
                    })

                }
                if (res.status === 400) {
                    clearInterval(this.interval)
                }
            } catch (error) {
                console.log(error)
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
                return alert("Not your turn")
            }
        } catch (error) {
            console.log(error)
        }
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
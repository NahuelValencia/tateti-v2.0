import React from 'react';
import { createGame } from '../service/GameApi';


class ButtonPlay extends React.Component {

    createGame = async () => {
        const headers = {
            'Authorization': this.props.data.player.session_token
        }

        const body = {
            players: [
                { id: this.props.data.room.player1 },
                { id: this.props.data.room.player2 }
            ],
            roomId: this.props.data.room.roomId
        }

        try {
            let res = await createGame(body, headers)
            console.log(res.response)
            if (res.status === 200) {
                console.log("Game created")
                console.log(res.response)
                this.props.callback(res.response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <button className='buttonPlay' onClick={this.createGame}>
                    PLAY
                </button>
            </div>
        )
    }
}

export default ButtonPlay;
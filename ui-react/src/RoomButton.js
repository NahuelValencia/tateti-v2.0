import React from 'react';
import { joinRoom } from './service/RoomApi';

class RoomButton extends React.Component {

    joinGame = async () => {
        let player = this.props.player
        let room = this.props.room

        const headers = {
            'Authorization': player.session_token
        }

        const playerId = {
            playerId: player.playerId
        }

        try {
            let res = await joinRoom(room.roomId, playerId, headers)
            if (res.status === 200) {
                this.props.callback(res.response) //send the created game to his parent componente
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <td>
                <button onClick={this.joinGame}>
                    Room {this.props.room.roomId}
                </button>
            </td >
        )
    }
}

export default RoomButton;
import React from 'react';
import axios from 'axios';

class RoomButton extends React.Component {

    joinGame = () => {
        let player = this.props.player
        let room = this.props.room

        const headers = {
            'Authorization': player.session_token
        }

        const playerId = {
            playerId: player.playerId
        }

        axios
            .post(`http://localhost:9000/room/${room.roomId}/join`, playerId, {
                headers: headers
            })
            .then(res => {
                if (res.status === 200) {

                    this.props.callback(res.data.response) //send the created game to his parent componente
                }
            })
            .catch(error => this.setState({ error, isLoading: false }));
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
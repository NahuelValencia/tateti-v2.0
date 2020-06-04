import React from 'react';
import axios from 'axios';

class RoomButton extends React.Component {
    constructor(props) {
        super(props)

        console.log("RoomButton")
        console.log(props)
    }

    joinGame = () => {
        console.log(`function to join a game`)

        let player = this.props.player
        let room = this.props.room

        console.log(player)
        console.log(room)

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
                    console.log("Status OK")
                    console.log(res.data.response)

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
import React from 'react';
import { createRoom } from '../service/RoomApi';

class CreateButton extends React.Component {

    createRoom = async () => {
        const headers = {
            'Authorization': this.props.state.player.session_token
        }

        const playerId = {
            playerId: this.props.state.player.playerId
        }

        try {
            let res = await createRoom(playerId, headers)
            if (res.status === 200) {
                console.log("Room Created")
                console.log(res.response)
                this.props.action(res.response, false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <td>
                <button onClick={this.createRoom}>
                    Create new game
                </button>
            </td >
        )
    }
}

export default CreateButton;
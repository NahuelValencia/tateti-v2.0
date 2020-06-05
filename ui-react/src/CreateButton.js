import React from 'react';
import axios from 'axios';

class CreateButton extends React.Component {

    createRoom = () => {
        const headers = {
            'Authorization': this.props.state.player.session_token
        }

        const playerId = {
            playerId: this.props.state.player.playerId
        }

        axios
            .post(`http://localhost:9000/room`, playerId, {
                headers: headers
            })
            .then(res => {
                if (res.status === 200) {
                    console.log("Status OK")

                    this.props.action(res.data.response, false)
                }
            })
            .catch(error => this.setState({ error, isLoading: false }));
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
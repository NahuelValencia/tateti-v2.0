import React from 'react';
import axios from 'axios';

class CreateButton extends React.Component {
    constructor(props) {
        super(props)
        console.log("CreateButton")
        console.log(props)
        this.state = { //TODO no hace falta este estado
            room: {},
            clicked: false
        }
    }

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
                    console.log(res.data.response)
                    this.setState({
                        room: res.data.response,
                        clicked: true
                    })
                    this.props.action(res.data.response, false)
                }
            })
            .catch(error => this.setState({ error, isLoading: false }));

        console.log(this.state)
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
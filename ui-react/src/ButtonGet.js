import React from 'react';
import axios from 'axios';
import CreateRoom from './CreateRoom';
import AvailableRooms from './AvailableRooms';

class ButtonGet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player: props.player,
            room: [],
            clicked: false,
            isLoading: true,
            error: null
        }

        this.handler = this.handler.bind(this);
    }

    handler(data) {
        this.props.callback(data)
    }

    getAvaiableRooms = () => {

        const headers = {
            'Authorization': this.props.player.session_token
        }

        axios
            .get(`http://localhost:9000/room`, {
                headers: headers
            })
            .then(res => {
                this.setState({
                    room: res.data.status === 200 ? res.data.response : [],
                    clicked: true,
                    isLoading: false
                });
            })
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {

        if (!this.state.clicked) {
            return (
                <div>
                    <p>Welcome {this.state.player.name}</p>
                    <br />
                    <button onClick={this.getAvaiableRooms}>
                        Join a game
                    </button>
                </div>
            )
        }

        return (
            <div>
                {this.state.room.length === 0 ?
                    <CreateRoom room={this.state} callback={this.handler} /> :
                    <AvailableRooms room={this.state} callback={this.handler} />
                }
            </div>
        )
    }
}

export default ButtonGet;
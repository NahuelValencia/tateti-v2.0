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
            isLoading: true,
            clicked: false,
            error: null
        }
        console.log("In ButtonGet to get rooms")
        console.log(props)
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
                console.log("response")
                console.log(res)

                this.setState({
                    room: res.data.status === 200 ? res.data.response : [],
                    isLoading: false,
                    clicked: true
                });
            })
            .catch(error => this.setState({ error, isLoading: false }));

        console.log("inButtonGet after call room")
        console.log(this.state)
    }

    render() {

        if (!this.state.clicked) {
            return (
                <div>
                    <button onClick={this.getAvaiableRooms}>
                        Join a game
                    </button>
                </div>
            )
        }

        return (
            <div>
                {this.state.room.length === 0 ?
                    <CreateRoom /> :
                    <AvailableRooms room={this.state.room} />
                }
            </div>
        )
    }
}

export default ButtonGet;
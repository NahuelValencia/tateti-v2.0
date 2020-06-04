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
        console.log(`get available rooms call`)
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
                console.log(`Really after asynchrounus call`)
                console.log(this.state)
            })
            .catch(error => this.setState({ error, isLoading: false }));
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
                    <CreateRoom room={this.state} /> :
                    <AvailableRooms room={this.state} />
                }
            </div>
        )
    }
}

export default ButtonGet;
import React from 'react';
import CreateRoom from './CreateRoom';
import AvailableRooms from './AvailableRooms';
import { getAvaiableRooms } from './service/RoomApi';

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

        this.handlerBack = this.handlerBack.bind(this);
    }

    handlerBack(data, isRoom, isGame) {
        if (isRoom) {
            this.props.callback(data)
        }
        if (isGame) {
            this.props.callbackGame(data)
        }
    }

    getAvaiableRooms = async () => {

        const headers = {
            'Authorization': this.props.player.session_token
        }

        try {
            let res = await getAvaiableRooms(headers)

            this.setState({
                room: res.status === 200 ? res.response : [],
                clicked: true,
                isLoading: false
            });
        } catch (error) {
            console.log(error)
        }
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
                    <CreateRoom room={this.state} callback={this.handlerBack} /> :
                    <AvailableRooms room={this.state} callback={this.handlerBack} />
                }
            </div>
        )
    }
}

export default ButtonGet;
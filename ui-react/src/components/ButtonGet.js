import React from 'react';
import CreateRoom from './CreateRoom';
import AvailableRooms from './AvailableRooms';
import { getAvaiableRooms } from '../service/RoomApi';

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
                    <div className='title'>
                        <h1>Welcome {this.state.player.name}</h1>
                        <br />
                    </div>
                    <div className='title'>
                        <button onClick={this.getAvaiableRooms}>
                            Join a room
                        </button>
                    </div>
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
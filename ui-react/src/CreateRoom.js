import React from 'react';
import CreateButton from './CreateButton';
import Timer from './Timer';

class CreateRoom extends React.Component {
    constructor(props) {
        super(props)
        console.log("CreateRoom")
        console.log(props)
        this.state = {
            noRoom: true,
            player: props.room.player,
            room: props.room.room
        }

        this.handler = this.handler.bind(this);
    }

    handler(room, isRoom) {
        this.setState({
            noRoom: isRoom,
            room: room
        });
    }

    render() {
        if (this.state.noRoom) {
            return (
                <div>
                    <p>There is no game at this moment. Create one please :)</p>
                    <br />
                    <table>
                        <tbody>
                            <tr>
                                <CreateButton state={this.state} action={this.handler} />
                            </tr>
                        </tbody>
                    </table>
                </div >
            )
        }

        return (
            <div>
                <p>Waiting for an oponent</p>
                <Timer data={this.state} action={this.handler} />
            </div>
        )
    }
}

export default CreateRoom;
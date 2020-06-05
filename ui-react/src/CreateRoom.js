import React from 'react';
import CreateButton from './CreateButton';
import Timer from './Timer';

class CreateRoom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            noRoom: true,  //true: there are NO room.
            player: props.room.player,
            room: props.room.room
        }

        this.handler = this.handler.bind(this);
        this.handlerBack = this.handlerBack.bind(this);
    }

    handler(room, isRoom) {
        this.setState({
            noRoom: isRoom,
            room: room
        });
    }

    handlerBack(data) {
        console.log(`1`)
        this.props.callback(data)
    }

    render() {
        if (this.state.noRoom) {   //there is no room
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
        //this is a timer after creating a room.
        return (
            <div>
                <p>Waiting for an oponent</p>
                <Timer data={this.state} action={this.handler} callback={this.handlerBack} />
            </div>
        )
    }
}

export default CreateRoom;
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
        }

        this.handler = this.handler.bind(this);
    }

    handler() {
        this.setState({
            noRoom: false,
        });
    }

    render() {
        if (this.state.noRoom) {
            return (
                <div>
                    <p>{this.props.room.player.name} there is no game at this moment. Create one please :)</p>
                    <br />
                    <table>
                        <tbody>
                            <tr>
                                <CreateButton player={this.props.room.player} state={this.state} action={this.handler} />
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }

        return (
            <div>
                <p>waiting for an oponent</p>
                <Timer />
            </div>
        )
    }
}

export default CreateRoom;
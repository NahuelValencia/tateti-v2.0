import React from 'react';
import CreateButton from './CreateButton';

class CreateRoom extends React.Component {
    constructor(props) {
        super(props)
        console.log("CreateRoom")
        console.log(props)
    }

    render() {
        return (
            <div>
                <p>{this.props.room.player.name} there is no game at this moment. Create one please :)</p>
                <br />
                <table>
                    <tbody>
                        <tr>
                            <CreateButton player={this.props.room.player} />
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default CreateRoom;
import React from 'react';
import RoomButton from './RoomButton';

class AvailableRoom extends React.Component {
    constructor(props) {
        super(props)
        console.log("AvailableRoom")
        console.log(props.room.room)
    }

    handler() {

    }

    render() {

        let room = this.props.room.room.map((item, index) => {
            return (
                <RoomButton key={index} room={item} player={this.props.room.player} action={this.handler} />
            );

        })

        return (
            <div>
                <p>There are {this.props.room.room.length} rooms available. Join one to have a great time</p>
                <br />
                <table>
                    <tbody>
                        <tr>
                            {room}
                        </tr>
                    </tbody>
                </table>
            </div>
        )


    }
}

export default AvailableRoom;
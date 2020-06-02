import React from 'react';
import RoomButton from './RoomButton';

class AvailableRoom extends React.Component {
    constructor(props) {
        super(props)
        console.log("AvailableRoom")
        console.log(props.room.room)
    }

    render() {

        let room = this.props.room.room.map((item, index) => {
            return (
                <RoomButton key={index} data={item.roomId} />
            );

        })

        return (
            <div>
                <p>{this.props.room.player.name} there are {this.props.room.room.length} rooms available. Join one to have a great time</p>
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
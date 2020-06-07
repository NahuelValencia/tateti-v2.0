import React from 'react';
import RoomButton from './RoomButton';

class AvailableRoom extends React.Component {
    constructor(props) {
        super(props)

        this.handler = this.handler.bind(this);
    }

    //send game to his parent
    handler(data) {
        console.log(`1`)
        this.props.callback(data, true, false)
    }

    render() {
        let room = this.props.room.room.map((item, index) => {
            return (
                <RoomButton key={index} room={item} player={this.props.room.player} callback={this.handler} />
            );

        })

        return (
            <div>
                <div className='title'>
                    <h3>There are {this.props.room.room.length} rooms available. Join one to have a great time</h3>
                    <br />
                </div>
                <div className='title'>
                    <table>
                        <tbody>
                            <tr>
                                {room}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default AvailableRoom;
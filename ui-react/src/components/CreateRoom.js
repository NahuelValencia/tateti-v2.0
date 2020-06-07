import React from 'react';
import CreateButton from './CreateButton';
import Timer from './Timer';
import { searchGameById } from '../service/GameApi'

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
        console.log(data)
        this.getGame(data.gameId)
    }

    getGame = async (gameId) => {
        const headers = {
            'Authorization': this.state.player.session_token
        }

        try {
            let res = await searchGameById(gameId, headers)
            if (res.status === 200) {
                this.props.callback(res.response, false, true)
            }
            if (res.status === 400) {
                clearInterval(this.interval)
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        if (this.state.noRoom) {   //there is no room
            return (
                <div>
                    <div className='title'>
                        <h3>There is no game at this moment. Create one please :)</h3>
                    </div>
                    <br />
                    <div className='title'>
                        <table>
                            <tbody>
                                <tr>
                                    <CreateButton state={this.state} action={this.handler} />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div >
            )
        }
        //this is a timer after creating a room.
        return (
            <div>
                <div className='title'>
                    <h3>Waiting for an oponent</h3>
                </div>
                <br />
                <div className='tittle'>
                    <Timer data={this.state} action={this.handler} callback={this.handlerBack} />
                </div>
            </div>
        )
    }
}

export default CreateRoom;
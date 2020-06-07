import React from "react";
import { searhRoomById, deleteRoom } from '../service/RoomApi'

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minutes: 2,
            seconds: 30
        };
    }

    componentDidMount() {
        this.startRunning()
    }

    componentWillUnmount() {
        clearInterval(this.interval) //TODO Why this doesn't unmount it?
    }

    startRunning = async () => {
        this.interval = setInterval(() => {
            const { minutes, seconds } = this.state
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.interval)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            }
        }, 1000)

        await this.checkForGame()
    }

    checkForGame = async () => {
        let roomId = this.props.data.room.roomId
        let authorization = this.props.data.player.session_token

        const headers = {
            'Authorization': authorization
        }

        this.interval = setInterval(async () => {
            try {
                let res = await searhRoomById(roomId, headers)
                if (res.status === 200 && res.response.available === "false" && res.response.gameReady === "true") { // if the room is no available means that another player has joined
                    clearInterval(this.interval)
                    this.setState({
                        minutes: 0,
                        seconds: 0
                    })
                    this.goBack(res.response)
                }
            } catch (error) {
                console.log(error)
            }
        }, 2000)
    }

    goBack(data) {
        this.props.callback(data)
    }

    addMinute = () => {
        this.setState({
            minutes: 1
        })
        this.startRunning()
    }

    leave = async () => {
        const headers = {
            'Authorization': this.props.data.player.session_token
        }

        const roomId = this.props.data.room.roomId

        try {
            let res = await deleteRoom(roomId, headers)
            if (res.status === 200) {
                console.log("Room deleted")
                this.props.action([], true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { minutes, seconds } = this.state
        if (minutes > 0 || seconds > 0) {
            return (
                <div className='title'>
                    <h3>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h3>
                </div>
            );
        }
        //leave or still waiting
        return (
            <div className='title'>
                <td>
                    <button onClick={this.addMinute}>+1 mins</button>
                </td>
                <td>
                    <button onClick={this.leave}>Leave</button>
                </td>
            </div>
        )

    }
}
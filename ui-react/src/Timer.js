import React from "react";
import axios from 'axios';


export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minutes: 2,
            seconds: 30
        };
        console.log(`in Timer`)
        console.log(props)
    }

    componentDidMount() {
        this.startRunning()
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    startRunning = () => {
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
    }

    addMinute = () => {
        this.setState({
            minutes: 1
        })
        this.startRunning()
    }

    leave = () => {
        const headers = {
            'Authorization': this.props.data.player.session_token
        }

        axios
            .delete(`http://localhost:9000/room/${this.props.data.room.roomId}`, {
                headers: headers
            })
            .then(res => {
                if (res.status === 200) {
                    console.log("Status OK")
                    console.log(res.data.response)

                    this.props.action([], true)
                }
            })
            .catch(error => this.setState({ error }));
    }

    render() {
        const { minutes, seconds } = this.state
        if (minutes > 0 || seconds > 0) {
            return (
                <div>
                    <p>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
                </div>
            );
        }
        //leave or still waiting
        return (
            <div>
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
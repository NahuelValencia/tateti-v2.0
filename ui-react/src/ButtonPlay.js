import React from 'react';
import axios from 'axios';


class ButtonPlay extends React.Component {

    createGame = () => {
        const headers = {
            'Authorization': this.props.data.player.session_token
        }

        const data = {
            players: [
                { id: this.props.data.room.player1 },
                { id: this.props.data.room.player2 }
            ],
            roomId: this.props.data.room.roomId
        }

        axios
            .post(`http://localhost:9000/game`, data, {
                headers: headers
            })
            .then(res => {
                if (res.status === 200) {
                    this.props.callback(res.data.response)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <div>
                <button onClick={this.createGame}>
                    PLAY
                    </button>
            </div>
        )
    }
}

export default ButtonPlay;
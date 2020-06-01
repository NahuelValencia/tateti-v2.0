import React from 'react';
import axios from 'axios';

class ButtonGet extends React.Component {
    constructor(props) {
        super(props);

    }

    getAvaiableRooms = () => {
        const headers = {
            'Authorization': 'bbb7e1552fc6fac4cd7a1318fd66dfc51ba9f5cb07c5744140bc1d3ba0298d104d54cb48f827dfaa28cf69ad510c7e9b5cd6fb7f91211a0d1ce6cd7cb0f6c18463a4834025a9e893949d7a7a96eaf074ad9486ed4d6f07c81bd0a1445b48024abb260a829aa9d7b737c9'
        }

        axios
            .get(`http://localhost:9000/room`, {
                headers: headers
            })
            .then(res => {
                if (res.status === 200) {
                    console.log("Status OK")
                    console.log(res.data)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }


    render() {
        return (
            <div>
                <button onClick={this.getAvaiableRooms}>
                    Join a game
                </button>
            </div>
        )
    }
}

export default ButtonGet;
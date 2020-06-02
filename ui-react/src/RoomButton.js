import React from 'react';

function RoomButton(props) {
    console.log("RoomButton")
    console.log(props)

    return (
        <td>
            <button>
                Room {props.data}
            </button>
        </td>
    )
}

export default RoomButton;
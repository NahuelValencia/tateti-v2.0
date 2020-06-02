import React from 'react';

function CreateButton(props) {
    console.log("CreateButton")
    console.log(props)

    return (
        <td>
            <button>
                Create new game
            </button>
        </td>
    )
}

export default CreateButton;
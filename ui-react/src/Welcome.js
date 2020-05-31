import React from 'react';


function Welcome(props) {
    console.log(`welcome`)
    console.log(props)
    if (props.state.sumbited === false) {
        return null;
    }

    return (
        <div>
            <p>Welcome {props.state.name}</p>

        </div>
    );
}

export default Welcome;
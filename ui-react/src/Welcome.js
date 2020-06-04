import React from 'react';

function Welcome(props) {
    console.log(`in Welcome`)
    console.log(props)

    return (
        <div>
            <p>Welcome {props.player.name}</p>
        </div>
    );
}

export default Welcome;
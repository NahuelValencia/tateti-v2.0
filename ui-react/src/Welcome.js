import React from 'react';
import ButtonGet from './ButtonGet';

function Welcome(props) {
    console.log(`in Welcome`)
    console.log(props)

    return (
        <div>
            <p>Welcome {props.player.name}</p>
            <br />
            <ButtonGet player={props.player} />
        </div>
    );
}

export default Welcome;
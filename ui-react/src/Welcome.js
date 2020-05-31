import React from 'react';
import ButtonGet from './ButtonGet';

function Welcome(props) {
    console.log(`welcome`)
    console.log(props)
    if (props.state.sumbited === false) {
        return null;
    }

    return (
        <div>
            <p>Welcome {props.state.name}</p>
            <br />
            <ButtonGet />
        </div>
    );
}

export default Welcome;
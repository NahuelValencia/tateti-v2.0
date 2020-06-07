import React from 'react'

function Cell(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.value}
        </ button>
    );
}

export default Cell;
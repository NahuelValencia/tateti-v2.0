import React, { Component } from 'react'

function Cell(props) {
    console.log(`in SQUARE`)
    console.log(props)
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.value}
        </ button>
    );
}

export default Cell;
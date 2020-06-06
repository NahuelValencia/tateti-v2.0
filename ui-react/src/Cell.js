import React, { Component } from 'react'

function Cell(props) {
    console.log(`in SQUARE`)
    console.log(props)
    return (
        <button>
            {props.value}
        </button>
    );
}

export default Cell;
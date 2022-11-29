import React from 'react'
import './badge.css'

const Badge = props => {
    console.log(`${props.type} badge`)
    return (
        <span className={`badge badge-${props.type} ${props.className}`}>
            {props.content}
        </span>
    )
}

export default Badge

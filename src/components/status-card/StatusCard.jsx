import React from 'react'
import Loader from 'react-loader-spinner'

import './statuscard.css'

const StatusCard = props => {
    return (
        <div style={props.style} className='status-card'>
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info">
                <h4>{props.count ?? <Loader type='Rings'/>}</h4>
                <span>{props.title}</span>
            </div>
        </div>
    )
}

export default StatusCard

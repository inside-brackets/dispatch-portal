import React from 'react'

import ReactTooltip from "react-tooltip";
import './tooltip.css'
const tooltip = (props) => {
  return (<>
    <ReactTooltip id={`${props.id}`} place="top" effect="solid" className="tooltips" arrowColor="none" style={{backgroundColor:"#fa1b23 "}} offset={{top:props.top || 0, left: props.left || 0,right:props.right || 0}}>
    {props.text}
  </ReactTooltip>
  </>
  )
}

export default tooltip
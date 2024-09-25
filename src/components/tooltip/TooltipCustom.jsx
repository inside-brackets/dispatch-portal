import React from 'react'

import ReactTooltip from "react-tooltip";
import './tooltip.css'
const tooltip = (props) => {
  return (<>
    <ReactTooltip id={`${props.id}`} place="top" effect="solid" className="tooltips"
     arrowColor="false"
    //  arrowColor="#fa1b23"
    //  style={{backgroundColor:"#fa1b23 "}} 
     content="hello world"
     offset={{top:props.top || -6, left: props.left || 0,right:props.right || 0}}>
   <span> {props.text}</span>
  </ReactTooltip>
  </>
  )
}

export default tooltip
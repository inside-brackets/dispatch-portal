import { useState } from 'react';
import {useEffect} from 'react';
const StatusDropdown=(props)=>{
const [isOpen,setIsOpen]=useState(false)
const [labelItem,setLabelItem]=useState(null)
const [typeDropdown,setTypeDropdown]=useState(null)

useEffect(()=>{
    const { label } = props.list[0];
    let firstItem = null;    
    if (typeof label != 'undefined') {
      checkType(false);
      firstItem = label;
    } else {
    checkType(true);
      firstItem = props.list[0];
    }  
    setLabelItem(firstItem)
},[])
let checkType = (value) => {
    setTypeDropdown(value)  
  };
  let showDropdown = () => {
    setIsOpen(true)
    document.addEventListener("click", hideDropdown);
  };
  let hideDropdown = () => {
    setIsOpen(false)
    document.removeEventListener("click", hideDropdown);
  };
  let chooseItem = (value) => {    
    if (labelItem !== value) {
      setLabelItem(value)
    }    
  };

  let renderDataDropDown = (item, index) => {    
    const {value, label} = typeDropdown ? {value: index, label: item} : item;    
    return (
      <li
        key={index}
        value={value}
        onClick={() => chooseItem(label)}
      >
        <a>{label}</a>
      </li> 
    )
  };

    return(
        <>
          <div className={`dropdown ${isOpen ? 'open' : ''}`}>
          <button className="dropdown-toggle" type="button" onClick={showDropdown}>
            {labelItem}
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            {props.list.map(renderDataDropDown)}
          </ul>
      </div>
        </>
    )
}
export default StatusDropdown

  

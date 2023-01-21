import React, { useRef, useState,useEffect } from 'react';
import bellNormal from '../../assets/images/notification/bellNormal.svg'
import bellNotified from '../../assets/images/notification/bellNotified.svg'
import ClosedIcon from '../../assets/images/notification/closedIcon.svg'
import MessageIcon from '../../assets/images/notification/messageIcon.svg'
import TicketIcon from '../../assets/images/notification/ticketIcon.svg'
import "./notifications.css";
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';
const clickOutsideRef = (content_ref, toggle_ref, setActive) => {
document.addEventListener("mousedown", (e) => {
        // user click toggle
        if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
        } else {
            // user click outside toggle and content
            if (content_ref.current && !content_ref.current.contains(e.target)) {
                setActive("");
            }
        }
    });
};

const Notifications = () => {
    const dropdown_toggle_el = useRef(null);
    const dropdown_content_el = useRef(null);
    const [active, setActive] = useState("");

    const [newNotifications, setNewNotifications] = useState(true)
    const [notifications, setNotifications] = useState([])
    let notificationsArray =[
        {
            icon:TicketIcon,
            location:"/trucks/616/892?q=issues",
            text:"New Ticketscreatd against Carrier name",
            createdAt:"2 minutes ago"
        },
        {
            icon:MessageIcon,
            location:"/trucks/616/892?q=issues",
            text:"John Doe commented on ticket#2 against name",
            createdAt:"3 hours ago"
        },
        {
            icon:ClosedIcon,
            location:"/trucks/616/892?q=issues",
            text:"Ticket#1 against %CarrierName, closed",
            createdAt:"2 minutes ago"
        },
    ]

    useEffect(() => {
        setNotifications(notificationsArray)
    },[])

    
    const clearHandler=()=>{
        setNotifications([]);
    }
    clickOutsideRef(dropdown_content_el, dropdown_toggle_el, setActive);
    return (
        <>
            <div onClick={() => { setActive((prev) => { if (prev === "active") { return ""; } else { return "active"; } }); }} className="dropdown">
                <button ref={dropdown_toggle_el} onClick={()=>{setNewNotifications(false)}} className="dropdown__toggle">
                    {newNotifications?<img src={bellNotified} />:<img src={bellNormal} />}
                </button>
                <div ref={dropdown_content_el} className={`dropdown__content ${active ? "active" : ""}`}>
                    <Card>
                        <Card.Body>
                            <div className="notifications_wrapper">
                                <div className="notification_header_container"><span className="notification_header_text">Notifications</span></div>
                                <hr />
                                <div className={`notifications_container ${notifications.length>0 ? null : 'no_notifications_container'}`}>
                                   {notifications.length>0?<>
                                        {notifications?.map((n,i)=>
                                        {
                                            return(
                                            <Link to={`${n.location}`} key={i}>
                                            <div className="notifications_items">
                                            <div><img src={n.icon} alt="ticket icon" /></div>
                                            <div>
                                                <div className="notification_item_text">{n.text}</div>
                                                <div className="notification_item_time">{n.createdAt}</div>
                                            </div>
                                        </div>
                                        </Link>
                                            )
                                        })
                                    }</>: "No new Notifications"}
                                </div>
                                <hr />
                                <div className="notifications_footer" onClick={clearHandler}><span>clear all</span></div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Notifications
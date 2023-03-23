import React, { useRef, useState, useEffect } from 'react';
import bellNormal from '../../assets/images/notification/bellNormal.svg'
import bellNotified from '../../assets/images/notification/bellNotified.svg'
import ClosedIcon from '../../assets/images/notification/closedIcon.svg'
import MessageIcon from '../../assets/images/notification/messageIcon.svg'
import TicketIcon from '../../assets/images/notification/ticketIcon.svg'
import { socket } from '../../index';
import "./notifications.css";
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { Howl } from "howler";
import notificationSound from "../../assets/audio/notification.wav";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import axios from 'axios';
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

var sound = new Howl({
    src: notificationSound,
});

const Notifications = () => {
    const dropdown_toggle_el = useRef(null);
    const dropdown_content_el = useRef(null);
    const currUser = useSelector((state) => state.user.user);
    const [active, setActive] = useState("");
    const [arrivalNotificaton, setArrivalNotificaton] = useState([]);
    const [newNotifications, setNewNotifications] = useState(false)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        socket.emit("addUser", currUser._id);
    }, [currUser, socket])

    useEffect(() => {
        socket.on("get-notification", (data) => {
            setArrivalNotificaton(data)
            sound.play();
        });
    }, [socket])
    useEffect(() => {
        arrivalNotificaton &&
            setNotifications((prev) => [arrivalNotificaton, ...prev]);
        setNewNotifications(true)
    }, [arrivalNotificaton]);

    useEffect(() => {
        const fetchNotifications = async () => {
            let { data } = await axios.post('/notification/get/all', {
                user: currUser._id
            })
            if (data) {
                let count = data.new
                if (count > 0) {
                    setNewNotifications(true)
                } else {
                    setNewNotifications(false)
                }
            }
            setNotifications(data.notifications)
        }
        fetchNotifications()
    }, [])
    const clearHandler = async () => {
        let clearNotifcations = await axios.post('/notification/clear/all', {
            user: currUser._id
        })
        setNotifications([]);
    }
    const newNotificationsHandler = async () => {
        let markASeen = await axios.post('/notification/seen/all', { user: currUser._id })
        setNewNotifications(false)
    }
    clickOutsideRef(dropdown_content_el, dropdown_toggle_el, setActive);
    return (
        <>
            <div onClick={() => { setActive((prev) => { if (prev === "active") { return ""; } else { return "active"; } }); }} className="dropdown">
                <button ref={dropdown_toggle_el} onClick={() => { setNewNotifications(false) }} className="dropdown__toggle">
                    {newNotifications ? <img src={bellNotified} onClick={newNotificationsHandler} /> : <img src={bellNormal} />}
                </button>
                <div ref={dropdown_content_el} className={`dropdown__content ${active ? "active" : ""}`}>
                    <Card style={{ marginBottom: "0px" }}>
                        <Card.Body>
                            <div className="notifications_wrapper">
                                <div className="notification_header_container"><span className="notification_header_text">Notifications</span></div>
                                <hr />
                                <div className={`notifications_container ${notifications.length > 0 ? null : 'no_notifications_container'}`}>
                                    {notifications.length > 0 ? <>
                                        {notifications?.map((n, i) => {
                                            let mc
                                            let tn
                                            if (currUser.department === "dispatch" && currUser.designation === "employee") {
                                                if (n.ticket) {
                                                    mc = n.ticket?.carrier.mc_number
                                                    if (n.ticket.carrier.trucks) {
                                                        tn = n.ticket.carrier.trucks[0].truck_number
                                                    }
                                                }
                                            }
                                            else {
                                                if (n.ticket) {
                                                    mc = n.ticket?.carrier.mc_number
                                                }
                                            }
                                            let urlLocation
                                            if (currUser.department === "dispatch" && currUser.designation === "employee") {
                                                urlLocation = `/trucks/${mc}/${tn}?q=issues`
                                            }
                                            else {
                                                urlLocation = `/carrierview/${mc}?q=issues`
                                            }
                                            return (
                                                <Link to={urlLocation} key={i}>
                                                    <div className="notifications_items">
                                                        <div><img src={n.icon === "created" ? TicketIcon : n.icon === "closed" ? ClosedIcon : MessageIcon} alt="ticket icon" /></div>
                                                        <div>
                                                            <div className="notification_item_text">{n.text?.replace(currUser.user_name, "you")}</div>
                                                            <div className="notification_item_time">{format(n.createdAt)}</div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                        }</> : "No new Notifications"}
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
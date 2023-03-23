import React, { useState, useRef, useEffect } from 'react';
import upIcon from "../../assets/images/carrierIssues/ExpandButtonUp.png"
import downIcon from "../../assets/images/carrierIssues/ExpandButtonDown.png"
import { Card, Row, Col, Spinner, Dropdown } from 'react-bootstrap'
import './accordion.css'
import Message from '../message/Message';
import { format } from "timeago.js";
import ChangeTicketStatusModal from "../modals/ChangeTicketStatusModal"
import { useParams } from "react-router";
import axios from 'axios';
import { useSelector } from "react-redux";
import { socket, initiateSocket } from "../../index";
const Accordion = ({ title, desc, status, dispatcherName, createdAt, files, id, ticketNo, fetchResponse }) => {
  const currUser = useSelector((state) => state.user.user);
  const [isActive, setIsActive] = useState(false);
  const [currentChat, setCurrentChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msgFile, setMsgFile] = useState(false);
  const [statusChangeModal, setStatusChangeModal] = useState(false)
  const [newMessage, setNewMessage] = useState("");
  const [loader, setLoader] = useState(false)
  const [chatFiles, setChatFiles] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState([]);
  const [notificationsUsers,setNotificationsUsers] = useState([])
  const params = useParams()
  const [fileList, setFileList] = useState(null);
  let msgFiles = fileList ? [...fileList] : [];
  useEffect(() => {
    if (id) initiateSocket(id);
    socket.on("send-message", (data) => {
      setArrivalMessage(data);
      setCurrentChat(true)
    });
  }, [id])
  useEffect(() => {
    arrivalMessage &&
      setMessages((prev) => [...prev, arrivalMessage]);
    let attach = arrivalMessage?.attachments
    if (attach && attach.length > 0) {
      setChatFiles((prev) => [...prev].concat(attach))
    }
  }, [arrivalMessage]);
  const handleSubmit = async (e, r) => {
    setCurrentChat(true)
    setLoader(true)
    e.preventDefault()
    let arr = [];
    let attachment = false
    if (fileList?.length > 0) {
      attachment = true
      for (let i = 0; i < fileList?.length; i++) {
        const { data: url } = await axios(
          `/s3url/ticket_conversation_documents/${currUser?.user_name
          }.${fileList[i].type.split("/")[1]
          }`
        );
        await axios.put(url, fileList[i]);
        arr[i] = {
          name: fileList[i].name,
          url: `${url.split("?")[0]}`
        }
      }
      setFileList(null)
    }
    let createMsg
    let createNotification
    try {
      createMsg = await axios.post('/ticket/create/message', {
        id: id,
        isAttachment: attachment,
        sender: currUser._id,
        message: newMessage,
        attachments: arr,
      })
      createNotification = await axios.post('/notification/create',{
        text:`Ticket #${ticketNo} message from ${currUser.user_name} and mc ${params.mc}`,
      icon:"message",
      ticket:id,
      users:notificationsUsers
      }
      )
      socket.emit("send-message", { newMsg: createMsg.data, r });
      socket.emit("send-notification",{userArr:notificationsUsers,notificationdata:createNotification.data})

    }
    catch (err) {
      console.log(err.message)
      setLoader(false)
    }
    setMsgFile(false)
    setNewMessage("")
    setLoader(false)
  }
  const changeStatusHandler = async () => {
    setStatusChangeModal(true)
  }
  let getCarrier = async () => {
    let { data } = await axios.post(`/getcarrier`, { mc_number: params.mc, })
    if (data) {
      let idd = data._id
      fetchResponse(idd)

      let createNotification = await axios.post('/notification/create',{
        text:`Ticket #${ticketNo} ${status === "open" ? "closed" : 'reopen'} against ${data.salesman.user_name } and mc ${data.mc_number}`,
        icon:`${status === "open" ? "closed" : 'created'}`,
        ticket:id,
        users:notificationsUsers
        }
          )
        socket.emit("send-notification",{userArr:notificationsUsers,notificationdata:createNotification.data})
    }
  }
  const submitstatusChange = async () => {
    axios.post('/ticket/update/status', {
      id: id,
      status: status === "open" ? "closed" : 'open'
    })
    setStatusChangeModal(false)
    getCarrier()
  }
  useEffect(() => {
    let getMessages = async () => {
      let { data } = await axios.post('/ticket/get/messages', { id: id, })
      if(data.messages.length > 0){
        setCurrentChat(true)
      }
      setMessages(data.messages)
      setChatFiles(data.chatFiles)
    }
    getMessages()
  }, [id])
  useEffect(() => {
    let getUsers = async () => {
      let { data } = await axios.post('/ticket/get/users', { id: id, })
      if(data){
        let userArr = []
        for (let i in data){
          if(i.toString()==="admins"){
            let arr = data[i]
            userArr = userArr.concat(arr)
          }else if(i.toString()==="others"){
          let arr = data[i]
          userArr = userArr.concat(arr)
          }else if(i.toString() === "managers"){
            let arr = data[i]
            userArr = userArr.concat(arr.sales)
            userArr = userArr.concat(arr.dispatch)
          }
        }
        let arr = userArr.filter(i => i!==currUser._id)
        setNotificationsUsers(arr)
      }
      // setChatFiles(data.chatFiles)
    }
    getUsers()
  }, [id])
  return (
    <>
      <Card className="accordion_card_wrapper" style={{ backgroundColor: "#fafafa" }}>
        <Card.Body>
          <div className="accordion_c_item">
            <div className="accordion_header">
              <div className="accordion_title_wrapper">
                <div><div className="ticket_counter">{ticketNo}</div></div>
                <div className="accordion_title_wrapper_item"><div className="ticket_title">{title}</div><div className="ticket_desc">{desc?.slice(0, 15)}...</div></div>
              </div>

              <div className="status_wrapper">
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">Status</div>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" className={`btn-sm ${status === "open" ? null : 'btn-danger'}`} id="dropdown-basic">
                      {status}
                    </Dropdown.Toggle>
                    {currUser.department === "dispatch" || currUser.department === "admin" ?(<>
                    <Dropdown.Menu className="dropDown_menu">
                      <Dropdown.Item onClick={changeStatusHandler} className={`dropDown_item ${status === "open" ? 'status_dropdown_close' : 'status_dropdown_open'}`}>{status === "open" ? 'Close' : "Open"}</Dropdown.Item>
                    </Dropdown.Menu>
                    </>)
                    :null}
                  </Dropdown>
                </div>
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">Dispatcher</div><div className="status_wrapper_item_value">{dispatcherName}</div></div>
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">{status === "open" ? 'Opened' : 'Closed'}</div><div className="status_wrapper_item_value">{format(createdAt)}</div></div>
              </div>
              <div onClick={() => setIsActive(!isActive)} className="navigate_btn">
                <img className="" src={isActive ? upIcon : downIcon} alt="navigate icon" />
              </div>
            </div>
            <div className={`${!isActive ? 'accordion_body_hidden' : 'accordion_body_show'}`}>
              <div className="accordion_hr"><hr /></div>
              <div className="accordion_content">
                <Row><Col md="9"><Card className="accordion_attachment">
                  <Card.Body>
                    <div className="inner_card_heading">Issues</div>
                    <hr />
                    <div className="issue_title">{title}</div>
                    <div className="issue_desc_wrapper">
                      <div className="issue_desc">
                        {desc}
                      </div>
                    </div>
                  </Card.Body></Card></Col>
                  <Col md="3"><Card className="accordion_attachment">
                    <Card.Body>
                      <div className="inner_card_heading">Attachements</div>
                      <hr />
                      <div className="issue_all_files_wrapper">
                        <div className="inner_card_heading_attchment">Ticket Files</div>
                        <hr />
                        <div className="issue_files_wrapper">
                          {files?.map((item) => {
                            return (
                              <>
                                <div className="issue_files_item_wrapper">
                                  <div><a href={item.url}><i className="bx bx-import action-button issue_file_icon"></i></a></div>
                                  <div className="issue_file_name">{item?.name.length > 20 ? item?.name.slice(0, 13) + '...' + item?.name.slice(-6) : item.name}</div>
                                </div>
                              </>
                            )
                          })}
                        </div>
                        <div className="inner_card_heading_attchment">Conversation Files</div>
                        <hr />
                        <div className="issue_files_wrapper">
                          {chatFiles?.map((item) => {
                            return (
                              <>
                                <div className="issue_files_item_wrapper">
                                  <div><a href={item.url}><i className="bx bx-import action-button issue_file_icon"></i></a></div>
                                  <div className="issue_file_name">{item?.name?.length > 20 ? item?.name.slice(0, 13) + '...' + item?.name.slice(-6) : item.name}</div>
                                </div>
                              </>
                            )
                          })}
                        </div>
                      </div>
                    </Card.Body></Card></Col></Row>

                {/* Messanger Card Start */}
                <div>
                  <Card >
                    <Card.Body style={{paddingBottom: "0px"}}>
                      <div className="inner_card_heading">Discussion</div>
                      <hr />
                      <div>
                        <div className="messages_wrapper" >
                          <div className="chatBox">
                            <div className="chatBoxWrapper">
                              {currentChat ? (
                                <>
                                  <div className="chatBoxTop" >
                                    {messages?.map((m) => (
                                      // <div ref={scrollRef}>
                                      <div>
                                        <Message message={m} />
                                      </div>
                                    ))}
                                  </div>
                                  <div />
                                </>
                              ) : (
                                <div className="noConversationText">
                                {/* <div className="chatBoxTop"> */}
                                  Start Conversation...
                                </div>
                              )}
                              
                            </div>
                          </div>
                          
                        </div>
                      </div>
                      {msgFile ? <div key={id} className="textarea_wrapper">
                                {msgFiles.map((file, i) => (
                                  <div key={i}>
                                    {file.name}
                                  </div>
                                ))}
                              </div> : null}
                              <form className="shareBottom">
                                <div className="input_button_wrapper">
                                  <div className="input_send_wrapper">
                                    <textarea type="text" placeholder='Type here...' className="input_send_message"
                                      onChange={(e) => setNewMessage(e.target.value)}
                                      value={newMessage}
                                      minLength={3}
                                    />
                                  </div>
                                  <div className="shareOptions">
                                    <label htmlFor={id} className="shareOption">
                                      <i className="bx bx-link-alt action-button shareButtonI "></i>
                                      <input
                                        style={{ display: "none" }}
                                        type="file"
                                        id={id}
                                        multiple
                                        onChange={(e) => {
                                          setFileList(e.target.files);
                                          setMsgFile(true)
                                        }}
                                      />
                                    </label>
                                  </div>
                                  <div>
                                    <button type="submit"
                                      className="shareButton"
                                      disabled={newMessage?.length < 3 ? true : loader ? true : status === "open"? false:true}
                                      onClick={(e) => { handleSubmit(e, id, newMessage) }}>
                                      Send
                                    </button>
                                  </div>
                                </div>
                              </form>
                    </Card.Body>
                  </Card>
                </div>
                {/* Messanger Card End */}
                
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <ChangeTicketStatusModal
        showModal={statusChangeModal}
        confirmModal={submitstatusChange}
        hideModal={() => setStatusChangeModal(false)}
        message={`Are you Sure want to ${status === "open" ? 'close' : 'open'} Ticket?`}
        title="Confirmation"
      />
    </>
  );
};

export default Accordion;
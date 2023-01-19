import React, { useState, useRef, useEffect } from 'react';
import upIcon from "../../assets/images/carrierIssues/ExpandButtonUp.png"
import downIcon from "../../assets/images/carrierIssues/ExpandButtonDown.png"
import { Card, Row, Col, Spinner, Dropdown } from 'react-bootstrap'
import './accordion.css'
import Message from '../message/Message';
import { format } from "timeago.js";
import ChangeTicketStatusModal from "../modals/ChangeTicketStatusModal"
import StatusDropdown from '../statusDropdown/StatusDropdown';
import { toast } from "react-toastify";
import { useParams } from "react-router";
import axios from 'axios';
import { useSelector } from "react-redux";
import { socket,initiateSocket } from "../../index";

const clickOutsideRef = (content_ref, toggle_ref, setStatusChange) => {
  document.addEventListener("mousedown", (e) => {
    // user click toggle
    if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
    } else {
      // user click outside toggle and content
      if (content_ref.current && !content_ref.current.contains(e.target)) {
        setStatusChange("");
      }
    }
  });
};
const Accordion = ({ title, desc, status, dispatcherName, createdAt, files, id, ticketNo, fetchResponse }) => {
  const currUser = useSelector((state) => state.user.user);
  // console.log(currUser, "currUser====>")
  const [isActive, setIsActive] = useState(false);
  const dropdown_toggle_el = useRef(null);
  const dropdown_content_el = useRef(null);
  const [currentChat, setCurrentChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const [msgFile, setMsgFile] = useState(false);
  const [statusChange, setStatusChange] = useState(false)
  const [statusChangeModal, setStatusChangeModal] = useState(false)
  const [newMessage, setNewMessage] = useState("");
  const [loader, setLoader] = useState(false)
  const [chatFiles, setChatFiles] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const params = useParams()
  const scrollRef = useRef();
  const [fileList, setFileList] = useState(null);

  const rooms = ['A', 'B', 'C'];
  const [room, setRoom] = useState(rooms[0]);

  let msgFiles = fileList ? [...fileList] : [];
  // setMsgFile(msgFiles)
  clickOutsideRef(dropdown_content_el, dropdown_toggle_el, setStatusChange);
  const fileName = [
    { name: "Chat.png" }, { name: "Recording.png" }, { name: "Voilation.png" },
  ]
  const notify = (msg) =>
    toast.info(msg, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    useEffect(() => {
      if (id) initiateSocket(id);
      // socket.emit('join', id);
    // socket.on("getMessage", (data) => {
    socket.on("send-message", (data) => {
      console.log(data,"getMessage==================================>")
      setArrivalMessage(data);
      // setMessages([...messages, data]);
    });
  },[id])
  useEffect(() => {
    arrivalMessage &&
    setMessages((prev) => [...prev, arrivalMessage]);
    //   currentChat?.members.includes(arrivalMessage.sender) &&
      
  }, [arrivalMessage]);
  const messagesarray = [
    {
      text: " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisi?",
      own: true,
      attachments: [
        {
          name: "Recording.png",
          url: "https://klsdfjklsdfj"
        },
        {
          name: "Recording2.png",
          url: "https://klsdfjklsdfj"
        },
        {
          name: "Recording3.png",
          url: "https://klsdfjklsdfj"
        },
        {
          name: "Recording.png",
          url: "https://klsdfjklsdfj"
        },
        {
          name: "Recording2.png",
          url: "https://klsdfjklsdfj"
        },
        {
          name: "Recording3.png",
          url: "https://klsdfjklsdfj"
        },
        {
          name: "Recording.png",
          url: "https://klsdfjklsdfj"
        },
        {
          name: "Recording2.png",
          url: "https://klsdfjklsdfj"
        },
        {
          name: "Recording3.png",
          url: "https://klsdfjklsdfj"
        },
      ]
    },
    {
      text: " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisiLorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisi?",
      own: false
    },
    {
      text: " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisiLorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisi?",
      own: false
    },
    {
      text: " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisiLorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisi?",
      own: true
    },
  ]
  const handleSubmit = async (e,r,nm) => {
    console.log(r,nm,"rrrrrrrrrrrnmmmmmmmmmmmmmmmm")
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
    }
    // console.log(chatFiles, "chatFiles")
    // console.log(arr, "arrof files")
    // arr.forEach((file) =>{
    //   setChatFiles([...chatFiles,file])
    // })

    setChatFiles([...chatFiles].concat(arr))
    let createMsg
    try {
      createMsg = await axios.post('/ticket/create/message', {
        id: id,
        isAttachment: attachment,
        sender: currUser._id,
        message: newMessage,
        attachments: arr,
      })
      let msg = createMsg.data.messages.slice(-1)[0]
      let newMsg = {
        id: id,
        isAttachment: attachment,
        attachments: msg.attachments, isAttachment: msg.attachments, message: msg.message, sender: {
          user_name: currUser.user_name,
          profile_image: currUser?.profile_image
        }, timestamp: msg.timestamp, _id: msg._id
      }
      socket.emit("send-message", {newMsg,r});
      setMessages([...messages, newMsg])
    }
    catch (err) {
      console.log(err.message)
      setLoader(false)
    }
    setMsgFile(false)
    setNewMessage("")
    setLoader(false)
  }
  const statusChangedropdown = () => {
    setStatusChange(!statusChange)
  }
  const changeStatusHandler = async () => {
    // axios.post('/ticket/update/status',{
    //   id:id,
    //   status:"closed"
    // })
    setStatusChangeModal(true)
  }
  let getCarrier = async () => {
    let { data } = await axios.post(`/getcarrier`, { mc_number: params.mc, })
    if (data) {
      let id = data._id
      fetchResponse(id)
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
      console.log(data)
      setMessages(data.messages)
      setChatFiles(data.chatFiles)
    }
    getMessages()
  }, [id])
  const handleFileChange = (e) => {
    setFileList(e.target.files);
    setMsgFile(true)
  }
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
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">Status</div><div className={`status_wrapper_item_value ${status === "open" ? 'status_open' : 'status_closed'}`} onClick={statusChangedropdown} ref={dropdown_toggle_el}>
                  {/* {statusChange && <div className={`status_dropdown ${status === "open" ? 'status_dropdown_close' : 'status_dropdown_open'}`} ref={dropdown_content_el} onClick={changeStatusHandler} >{status === "open" ? 'Close' : "Open"}</div>} */}
                  <Dropdown>
                    <Dropdown.Toggle variant="success" className={`btn-sm ${status === "open" ? null : 'btn-danger'}`} id="dropdown-basic">
                      {status}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropDown_menu">
                      <Dropdown.Item onClick={changeStatusHandler} className={`dropDown_item ${status === "open" ? 'status_dropdown_close' : 'status_dropdown_open'}`}>{status === "open" ? 'Close' : "Open"}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  {/* {status} */}
                </div>

                </div>
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">Dispatcher</div><div className="status_wrapper_item_value">{dispatcherName}</div></div>
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">{status === "open" ? 'Opened' : 'Closed'}</div><div className="status_wrapper_item_value">{format(createdAt)}</div></div>
              </div>
              <div onClick={() => setIsActive(!isActive)} className="navigate_btn">
                <img className="" src={isActive ? upIcon : downIcon} alt="navigate icon" />
              </div>
            </div>
            {/* {isActive && <> */}
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
                                  <div className="issue_file_name">{item?.name.length > 20 ? item?.name.slice(0, 13) + '...' + item?.name.slice(-6) : item.name}</div>
                                </div>
                              </>
                            )
                          })}
                        </div>
                      </div>
                    </Card.Body></Card></Col></Row>

                {/* Messanger Card Start */}
                <div>
                  <Card>
                    <Card.Body>
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
                                      <div ref={scrollRef}>
                                        {/* <Message  /> */}
                                        <Message message={m}/>
                                      </div>
                                    ))}

                                  </div>
                                  <div />
                                </>
                              ) : (
                                <span className="noConversationText">
                                  Start Conversation...
                                </span>
                              )}
                                    {msgFile ? <div key={id} className="textarea_wrapper">
                                      {msgFiles.map((file, i) => (
                                        <div key={i}>
                                          {file.name}
                                        </div>
                                      ))}
                                    </div> : null}
                              <form className={`shareBottom ${currentChat === false ? 'noCon' : ''}`}>

                                <div className="input_button_wrapper">
                                  <div className="input_send_wrapper">
                                    <textarea type="text" placeholder='Type here...' className="input_send_message"
                                      onChange={(e) => setNewMessage(e.target.value)}
                                      value={newMessage}
                                      minlength={3}
                                    />
                                  </div>
                                  <div className="shareOptions">

                                    <label htmlFor="file" className="shareOption">
                                      <i className="bx bx-link-alt action-button shareButtonI "></i>
                                      <input
                                        style={{ display: "none" }}
                                        type="file"
                                        id="file"
                                        multiple
                                        // onChange={handleFileChange}
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
                                      disabled={newMessage?.length < 3 ? true : loader ? true : false}
                                      onClick={(e)=>{handleSubmit(e,id, newMessage)}}
                                    >
                                      {/* {loader ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )
                : null} */}
                                      Send
                                      {/* <i className="bx bx-send action-button shareButtonI "></i> */}
                                    </button>

                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>


                          {/* </div> */}
                        </div>
                      </div>
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
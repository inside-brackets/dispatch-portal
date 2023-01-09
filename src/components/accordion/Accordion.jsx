import React, { useState, useRef,useEffect } from 'react';
import upIcon from "../../assets/images/carrierIssues/ExpandButtonUp.png"
import downIcon from "../../assets/images/carrierIssues/ExpandButtonDown.png"
import { Card, Row, Col, Button } from 'react-bootstrap'
import './accordion.css'
import Message from '../message/Message';
import StatusDropdown from '../statusDropdown/StatusDropdown';
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
const Accordion = ({ title, content, status, index }) => {
  const [isActive, setIsActive] = useState(false);
  const dropdown_toggle_el = useRef(null);
  const dropdown_content_el = useRef(null);
  const [currentChat, setCurrentChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [statusChange,setStatusChange] = useState(false)
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();
  clickOutsideRef(dropdown_content_el, dropdown_toggle_el, setStatusChange);
  const fileName = [
    { name: "Chat.png" }, { name: "Recording.png" }, { name: "Voilation.png" },
  ]

  const messagesarray=[
    {
      text:" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisi?",
      own:true
    },
    {
      text:" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisiLorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisi?",
      own:false
    },
    {
      text:" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisiLorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisi?",
      own:false
    },
    {
      text:" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisiLorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, deleniti enim iusto explicabo numquam voluptatibus odit doloremque perferendis id eius mollitia eos ducimus repellat sapiente, itaque accusamus architecto, earum nisi?",
      own:true
    },
  ]
  const handleSubmit =(e)=>{
    setCurrentChat(true)
    e.preventDefault()

    let newMsg = {
      text:newMessage,
      own:true
    } 
    setMessages([...messages,newMsg])
    setNewMessage("")
  }
  const statusChangeHandler =()=>{
    setStatusChange(!statusChange)
  }
  useEffect(()=>{
    setMessages(messagesarray)
  },[])

  return (
    <>
      <Card className="accordion_card_wrapper" style={{ backgroundColor: "#fafafa" }}>
        <Card.Body>
          <div className="accordion_c_item">
            <div className="accordion_header">
              <div className="accordion_title_wrapper">
                <div><div className="ticket_counter">{index + 1}</div></div>
                <div className="accordion_title_wrapper_item"><div className="ticket_title">{title}</div><div className="ticket_desc">{content.slice(0, 15)}...</div></div>
              </div>

              <div className="status_wrapper">
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">Status</div><div className={`status_wrapper_item_value ${status === "Open" ? 'status_open' : 'status_closed'}`} onClick={statusChangeHandler} ref={dropdown_toggle_el}>
                  {statusChange && <div className={`status_dropdown ${status === "Open" ? 'status_dropdown_close' :'status_dropdown_open'}`} ref={dropdown_content_el} >{status === "Open" ? 'Close' : 'Open'}</div>}
                  {status}</div></div>
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">Dispatcher</div><div className="status_wrapper_item_value">John Doe</div></div>
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">{status === "Open" ? 'Opened' : 'Closed'}</div><div className="status_wrapper_item_value">3 Days ago</div></div>
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
                      {content}
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
                        {fileName.map((item) => {
                          return (
                            <>
                              <div className="issue_files_item_wrapper">
                                <div><i className="bx bx-import action-button issue_file_icon"></i></div>
                                <div className="issue_file_name">{item.name}</div>
                              </div>
                            </>
                          )
                        })}
                      </div>
                      <div className="inner_card_heading_attchment">Conversation Files</div>
                      <hr />
                      <div className="issue_files_wrapper">
                        {fileName.map((item) => {
                          return (
                            <>
                              <div className="issue_files_item_wrapper">
                                <div><i className="bx bx-import action-button issue_file_icon"></i></div>
                                <div className="issue_file_name">{item.name}</div>
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
                                    {messages.map((m) => (
                                    <div ref={scrollRef}>
                                      {/* <Message  /> */}
                                      <Message message={m} own={m.own} />
                                    </div>
                                     ))}
                                     
                                  </div>
                                  <div  /> 
                                </>
                              ) : (
                                <span className="noConversationText">
                                  Start Conversation...
                                </span>
                              )}
                                    <form className={`shareBottom ${currentChat===false?'noCon':''}`}>
                                    <div className="input_button_wrapper">
                                    <div className="input_send_wrapper">
                                      <textarea type="text" placeholder='Type here...' className="input_send_message"
                                                          onChange={(e) => setNewMessage(e.target.value)}
                                                          value={newMessage}
                                      />
                                    </div>
                                      <div className="shareOptions">
                                        <label htmlFor="file" className="shareOption">
                                          <i className="bx bx-link-alt action-button shareButtonI "></i>
                                          <input
                                            style={{ display: "none" }}
                                            type="file"
                                            id="file"
                                          onChange={(e) => setFile(e.target.files[0])}
                                          />
                                        </label>
                                      </div>
                                    <div>
                                      <button type="submit" 
                                      className="shareButton"
                                      disabled={newMessage.length ===0?true:false}
                                      onClick={handleSubmit}
                                      >
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
    </>
  );
};

export default Accordion;
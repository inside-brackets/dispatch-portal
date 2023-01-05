import React, { useState } from 'react';
import upIcon from "../../assets/images/carrierIssues/ExpandButtonUp.png"
import downIcon from "../../assets/images/carrierIssues/ExpandButtonDown.png"
import { Card, Row, Col } from 'react-bootstrap'
import './accordion.css'
const Accordion = ({ title, content, status, index }) => {
  const [isActive, setIsActive] = useState(false);

  const fileName = [
    { name: "Chat.png" }, { name: "Recording.png" }, { name: "Voilation.png" },
  ]

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
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">Status</div><div className={`status_wrapper_item_value ${status === "Open" ? 'status_open' : 'status_closed'}`}>{status}</div></div>
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">Dispatcher</div><div className="status_wrapper_item_value">John Doe</div></div>
                <div className="status_wrapper_item"><div className="status_wrapper_item_name">{status === "Open" ? 'Opened' : 'Closed'}</div><div className="status_wrapper_item_value">3 Days ago</div></div>
              </div>
              <div onClick={() => setIsActive(!isActive)} className="navigate_btn">
                <img className="" src={isActive ? upIcon : downIcon} alt="navigate icon" />
              </div>
            </div>
            {/* {isActive && <> */}
              <div className={`${!isActive?'accordion_body_hidden':'accordion_body_show'}`}>
                <div className="accordion_hr"><hr /></div>
                <div className="accordion_content">
                  <Row><Col md="9"><Card className="accordion_attachment">
                    <Card.Body>
                      <div className="inner_card_heading">Issues</div>
                      <hr />
                      <div className="issue_title">{title}</div>
                      <div className="issue_desc">
                        {content}
                      </div>
                    </Card.Body></Card></Col>
                    <Col md="3"><Card className="accordion_attachment">
                      <Card.Body><div className="inner_card_heading">Attachements</div>
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
                      </Card.Body></Card></Col></Row>
                </div>
              </div>
            {/* </>
            } */}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Accordion;
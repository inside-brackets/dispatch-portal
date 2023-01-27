import React from 'react';
import { Row, Col, Card } from "react-bootstrap"
import './carrierUpdates.css'

const CarrierUpdates=()=>{
    return(
        <>
        <div className="c_u_wrapper">
            <Card>

              <Card.Body>
                <div className="c_u_items_wrapper">

                  <div className="c_u_item_wrapper">
                    <div>
                      <div className="c_u_item_vertical"></div>
                    </div>
                    <div className="c_u_item_text_wrapper">
                      <div className="c_u_item_text">Carrier Registered mc 49 Saleperson Changeme</div>
                      <div className="c_u_item_time">2 mintues ago</div>
                    </div>
                  </div>
                  <hr />
                  <div className="c_u_item_wrapper">
                    <div>
                      <div className="c_u_item_vertical"></div>
                    </div>
                    <div className="c_u_item_text_wrapper">
                      <div className="c_u_item_text">Carrier Registered mc 49 Saleperson Changeme</div>
                      <div className="c_u_item_time">2 mintues ago</div>
                    </div>
                  </div>
                  <hr />
                  <div className="c_u_item_wrapper">
                    <div>
                      <div className="c_u_item_vertical"></div>
                    </div>
                    <div className="c_u_item_text_wrapper">
                      <div className="c_u_item_text">Carrier Registered mc 49 Saleperson Changeme</div>
                      <div className="c_u_item_time">2 mintues ago</div>
                    </div>
                  </div>
                  <hr />
                  <div className="c_u_item_wrapper">
                    <div>
                      <div className="c_u_item_vertical"></div>
                    </div>
                    <div className="c_u_item_text_wrapper">
                      <div className="c_u_item_text">Carrier Registered mc 49 Saleperson Changeme</div>
                      <div className="c_u_item_time">2 mintues ago</div>
                    </div>
                  </div>
                  <hr />
                </div>
              </Card.Body>
            </Card>

            <div className="c_u_title">
              <Card className="card_c_u_title">

                <Card.Body>
                  <div className="c_u_header_wrapper">
                    <div>
                      <i className={`bx bx-message-alt-detail`}></i>
                    </div>
                    <div>
                      <span className="c_u_header_text">
                        Carrier Updates
                      </span>

                    </div>

                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>

        </>
    )
}
export default CarrierUpdates
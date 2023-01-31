import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from "react-bootstrap"
import './carrierUpdates.css'
import { format } from 'timeago.js'
import Loader from "react-loader-spinner";
import { socket } from '../../index'
import status_map from '../../assets/JsonData/status_map.json'
import { useSelector } from "react-redux";

const CarrierUpdates = () => {
  const [cupdates, setCUpdates] = useState([])
  const [isloading, setIsLoading] = useState(false)
  const currUser = useSelector((state) => state.user.user);

  useEffect(() => {
    socket.on("get-carrier-updates", (data) => {
      setCUpdates((prev) => [data, ...prev])
    });
  }
    , [socket])

  useEffect(() => {
    const carriersUpdates = async () => {
      setIsLoading(true)
      let { data } = await axios.get('/updatescarriers')
      setCUpdates(data)
      setIsLoading(false)
    }
    carriersUpdates()
  }, [])
  return (
    <>
      <div className="c_u_wrapper">
        <Card>
          <Card.Body>
            <div className="c_u_items_wrapper">
              {isloading ?
                (<div className="spreadsheet__loader">
                  <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
                </div>) :
                (<>
                  {cupdates.length > 0 ? <>
                    {cupdates.map((u) => {
                      return (
                        <div key={u._id}>
                          <div className="c_u_item_wrapper">
                            <div>
                              <div className="c_u_item_vertical"></div>
                            </div>
                            <div className="c_u_item_text_wrapper">
                              <div className="c_u_item_text">
                                {currUser.user_name === u.saleperson ? "You" : `${u.saleperson}`}  <span className={`text-${status_map[u.change]}`}> {u.change.charAt(0).toUpperCase() + u.change.slice(1)} </span>
                                Carrier {u.carrier}
                              </div>
                              <div className="c_u_item_time">{format(u.createdAt)}</div>
                            </div>
                          </div>
                          <hr />
                        </div>
                      )
                    })}
                  </> : <>Not Enough Data to show</>
                  }
                </>
                )

              }
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
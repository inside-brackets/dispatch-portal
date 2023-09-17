import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../hooks/use-https";
import MyButton from "../../components/UI/MyButton";
import MySelect from "../../components/UI/MySelect";
import Modal from "../../components/modals/MyModal";
import TextArea from "../../components/UI/TextArea";
import Loader from "react-loader-spinner";
import { useSelector } from "react-redux";
import axios from "axios";
import { Row, Col, Card, Button } from "react-bootstrap";
import Badge from "../../components/badge/Badge";
import moment from "moment";
import "../../assets/css/sales/appointmentCards.css";
import { toast } from "react-toastify";

const Appointments = (props) => {
  const { _id: currUserId } = useSelector((state) => state.user.user);
  const [carriersList, setCarriersList] = useState([]);
  const [currentmc, setCurrentMC] = useState();
  const { isLoading, error: httpError, sendRequest: fetchCarrier } = useHttp();
  const [savedCarriers, setSavedCarries] = useState([]);
  const [onClear, setOnClear] = useState();
  const [inValue, setInValue] = useState("");
  const [assignedStatus, setAssignedStatus] = useState({
    label: "All",
    value: null,
  });
  const [threeMonthsAgo] = useState(new Date().setMonth(new Date().getMonth() - 3))
  const history = useHistory();

  //changes//
  const onConfirm = (mc) => {
    setCurrentMC(mc);
    setrModal(true);
  };
  const [rmodal, setrModal] = useState();
  const commentRef = useRef();

  const rejectMC = async () => {
    await axios.put(`/updatecarrier/${currentmc}`, {
      c_status: "rejected",
      comment: commentRef.current.value,
    });
    setCurrentMC();
    setrModal(false);
    setCarriersList((prev) => {
      const temp_list = prev;
      return temp_list.filter((carrier) => carrier.mc_number !== currentmc);
    });
    setSavedCarries((prev) => {
      const temp_list = prev;
      return temp_list.filter((carrier) => carrier.mc_number !== currentmc);
    });
    setOnClear((prev) => {
      const temp_list = prev;
      return temp_list.filter((carrier) => carrier.mc_number !== currentmc);
    });
  };
  const onrClose = () => {
    setrModal(false);
  };
  //changes//
  useEffect(() => {
    const transformData = (data) => {
      setOnClear(data);
      if (data === null) {
        return;
      }
      data.sort((a, b) => {
        return new Date(b.appointment) - new Date(a.appointment);
      });

      const staleAppointments = data.filter((c) => new Date(c.updatedAt) < threeMonthsAgo).length;
      setCarriersList(data);

      if (staleAppointments) {
        toast.warning(
          `You have ${staleAppointments} unavailing appointment${
            staleAppointments > 1 ? "s" : ""
          }. Be sure to clear out your clutter.`
        );
      }
    };
    let body = {
      salesman: currUserId,
      c_status: "appointment",
    };
    if (assignedStatus.value !== null) {
      body.manually_assigned = assignedStatus.value;
    }
    fetchCarrier(
      {
        url: `/getcarriers`,
        method: "POST",
        body,
      },
      transformData
    );
  }, [fetchCarrier, currUserId, assignedStatus, threeMonthsAgo]);

  //search
  const clearHanler = () => {
    setCarriersList(onClear);
    setSavedCarries((prev) => {
      const temp_list = prev;
      return temp_list.filter((carrier) => carrier.mc_number !== currentmc);
    });
    setInValue("");
  };

  const search = (e) => {
    if (e.key === "Enter") {
      var searchValue = inValue.trim();
      if (searchValue.length !== 0) {
        const searched = carriersList.filter((carrier) => {
          if (!isNaN(searchValue)) {
            return carrier.mc_number === parseInt(inValue.trim());
          } else {
            searchValue = searchValue.toLowerCase();
            if (carrier.company_name.toLowerCase().includes(searchValue.toLowerCase())) {
              return true;
            }
            return false;
          }
        });
        if (searched.length !== 0) {
          setSavedCarries(carriersList);
          setCarriersList(searched);
        }
        // if(savedCarriers.length !== 0)
        else {
          setCarriersList(savedCarriers);
          setSavedCarries([]);
        }
      }
    }
  };

  const body = (carrier) => {
    return (
      <Row className="mb-2">
        <Col md={6} style={{ borderStyle: "groove none none groove" }}>
          <h5>MC: </h5>
        </Col>
        <Col md={6} style={{ borderStyle: "groove groove none groove" }}>
          <h6> {carrier.mc_number}</h6>
        </Col>
        <Col md={6} style={{ borderStyle: "groove none none groove" }} class="border-right-0">
          <h5>Phone:</h5>{" "}
        </Col>
        <Col md={6} style={{ borderStyle: "groove groove none groove" }}>
          <h6>{carrier.phone_number}</h6>
        </Col>

        <Col md={6} style={{ borderStyle: "groove none none groove" }}>
          <h5>Assigned by Manager?</h5>{" "}
        </Col>
        <Col md={6} style={{ borderStyle: "groove groove none groove" }}>
          <h6>{carrier.manually_assigned ? "Yes" : "No"}</h6>
        </Col>
        <Col md={4} style={{ borderStyle: "groove none none groove" }}>
          <h5>Email:</h5>
        </Col>
        <Col md={8} style={{ borderStyle: "groove groove none groove" }}>
          <h6>{carrier.email}</h6>
        </Col>
        <Col md={4} style={{ borderStyle: "groove none groove groove" }}>
          <h5>Comment:</h5>{" "}
        </Col>

        <Col
          md={8}
          style={{
            borderStyle: "groove groove groove groove",
            maxHeight: 60,
            minHeight: 60,
            overflow: "hidden",
          }}
        >
          <h6 className="text-muted">
            {carrier.comment?.length >= 35
              ? `${carrier.comment.substring(0, Math.min(carrier.comment.length, 60)).trim()}...`
              : carrier.comment}
          </h6>
        </Col>
      </Row>
    );
  };
  var appointmentList = (
    <div className="appointment__loader">
      <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
    </div>
  );
  if (isLoading && !httpError) {
    appointmentList = (
      <div className="appointment__loader">
        <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && httpError) {
    appointmentList = (
      <div className="appointment__loader">
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  } else if (carriersList.length === 0)
    appointmentList = (
      <div className="appointment__loader">
        <h2 style={{ color: "green" }}>No Appointments yet.</h2>
      </div>
    );
  else {
    appointmentList = (
      <div className="row">
        {carriersList.map((item, index) => (
          <div className="col-4" key={index}>
            <Card className="card-height">
              <Card.Body>
                <Card.Title
                  style={{
                    height: "15px",
                  }}
                >
                  {item.company_name}{" "}
                  {new Date(item.updatedAt) < threeMonthsAgo && <Badge type="warning" content="Stale Appointment" />}
                </Card.Title>
                <hr />
                <Card.Text className="">{body(item)}</Card.Text>
                <Card.Footer className="card-title">
                  {<h5>{`Time: ${moment(new Date(item.appointment)).format("llll")}`}</h5>}
                </Card.Footer>
                <div className="d-flex justify-content-between" style={{ marginTop: "10px" }}>
                  <MyButton
                    className="appCard-btn"
                    color="red"
                    buttonText={"Reject"}
                    onClick={() => {
                      onConfirm(item.mc_number);
                    }}
                    onClose={onrClose}
                    mc={item.mc_number}
                  />
                  <MyButton
                    className="appCard-btn"
                    color="primary"
                    buttonText={"Details"}
                    onClick={() => {
                      history.push(`/carrierview/${item.mc_number}`);
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    );
  }
  return (
    <Row>
      <Row className="align-items-center mb-3">
        <Col md={3}>
          <label className="mb-2">Search:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Company / MC"
            icon="bx bx-search"
            value={inValue}
            onKeyDown={search}
            onChange={(event) => setInValue(event.target.value)}
          />
        </Col>
        <Col className="mt-4" md={6}>
          <Button onClick={clearHanler} size="lg">
            Clear
          </Button>
        </Col>
        <Col md={3}>
        <label className="mb-2 ml-1">Filter:</label>

          <MySelect
            isMulti={false}
            value={assignedStatus}
            onChange={setAssignedStatus}
            options={[
              {
                label: "All",
                value: null,
              },
              {
                label: "Assigned to me",
                value: true,
              },
              // {
              //   label: "My Appointments",
              //   value: false,
              // },
            ]}
          />
        </Col>
      </Row>
      <h6>Showing {carriersList.length} appointments</h6>
      {appointmentList}
      <Modal show={rmodal} heading="Reject Carrier" onConfirm={rejectMC} onClose={onrClose}>
        <form>
          <TextArea
            name="Comment:"
            placeholder="Comment here..."
            defaultValue={commentRef.current && commentRef.current.value}
            ref={commentRef}
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          ></div>
        </form>
      </Modal>
    </Row>
  );
};

export default Appointments;

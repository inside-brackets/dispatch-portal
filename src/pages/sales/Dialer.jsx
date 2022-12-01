import React, { useState, useEffect, useRef } from "react";
import DialerCard from "../../components/cards/Card";
import Modal from "../../components/modals/MyModal";
import Input from "../../components/UI/MyInput";
import Loader from "react-loader-spinner";
import useHttp from "../../hooks/use-https";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { change } from "../../store/appointment";
import axios from "axios";

import TextArea from "../../components/UI/TextArea";
import { Row, Col } from "react-bootstrap";

const Dialer = () => {
  const { user } = useSelector((state) => state.user);
  const appointmentRef = useRef();
  const commentRef = useRef();
  const commentrRef = useRef();
  const dispatch = useDispatch();
  const [rmodal, setrModal] = useState();
  const [modal, setModal] = useState();
  const [carrier, setCarrier] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [defaultComment, setDefaultComment] = useState(null);
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();
  const { sendRequest: postCarriers } = useHttp();
  const { sendRequest: postdidnotPickCarriers } = useHttp();

  const { sendRequest: postrejectCarriers } = useHttp();

  const options = [
    { label: "Not Interested", value: "Not Interested" },
    { label: "Inhouse Dispatch", value: "Inhouse Dispatch" },
    { label: "Not working right now", value: "Not working right now" },
    { label: "Truck down", value: "Truck down" },
    { label: "Do not call me", value: "Do not call me" },
    { label: "Working in a Contract", value: "Working in a Contract" },
    { label: "Other", value: "" },
  ];
  const handleChange = (text, index) => {
    setDefaultComment({
      text,
      index,
    });
  };


  // make appointment
  const onConfirm = async () => {
    setLoading(true);
    incrementCounter();
    const transformData = (data) => {
      setrefresh(!refresh);
      setModal(false);
    };
    await postCarriers(
      {
        url: `/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        body: {
          c_status: "appointment",
          comment: commentRef.current.value,
          appointment: new Date(appointmentRef.current.value),
        },
      },
      transformData
    );
    dispatch(change(Math.random()));
    setLoading(false);
    setCarrier(null);
  };

  const didnotPickHandler = async () => {
    setLoading(true);
    incrementCounter();
    const transformData = (data) => {
      setrefresh(!refresh);
    };
    await postdidnotPickCarriers(
      {
        url: `/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        body: {
          c_status: "didnotpick",
        },
      },
      transformData
    );
    setLoading(false);
    setCarrier(null);
  };
  const buttonClickHandler = () => {
    setModal(true);
  };

  const onClose = () => {
    setModal(false);
    setLoading(false);
  };
  const onrClose = () => {
    setrModal(false);
    setLoading(false);
  };

  // reject
  const onrConfirm = async () => {
    setLoading(true);
    incrementCounter();
    const transformData = (data) => {
      setrefresh(!refresh);
      setrModal(false);
    };
    await postrejectCarriers(
      {
        url: `/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        body: {
          c_status: "rejected",
          comment: defaultComment?.text ?? "",
        },
      },
      transformData
    );
    setLoading(false);
    setCarrier(null);
  };

  const buttonrClickHandler = () => {
    setrModal(true);
    setLoading(false);
  };

  // fetch new
  useEffect(() => {
    fetchCarriers(
      {
        url: `/sales/fetchlead`,
        method: "POST",
        body: {
          _id: user._id,
        },
      },
      (data) => setCarrier(data)
    );
  }, [fetchCarriers, refresh, user]);

  useEffect(() => {
    let counterObj = JSON.parse(localStorage.getItem("counters"));
    var timeOut = 1000;

    if (counterObj) {
      const now = new Date();
      const reset = new Date(counterObj.reset);
      timeOut = Math.max(reset - now, 1000);
      setCounter(counterObj.counter);
      const timer = setTimeout(() => {
        let temp = new Date();
        let reset = new Date(temp.setDate(temp.getDate() + 1)).setHours(
          17,
          0,
          0
        );
        setCounter(counterObj.counter);
        // set Date today 5 pm and set count field to 0
        localStorage.setItem(
          "counters",
          JSON.stringify({
            counter: 0,
            reset,
          })
        );
        setCounter(0);
      }, timeOut);
      return () => clearTimeout(timer);
    } else {
      axios
        .get(`/sales/fetch-counter/${user._id}`)
        .then((res) => {
          let temp = new Date();
          let reset = new Date(temp.setDate(temp.getDate() + 1)).setHours(
            17,
            0,
            0
          );

          // set Date today 5 pm and set count field to 0
          localStorage.setItem(
            "counters",
            JSON.stringify({
              counter: res.data.result.length,
              reset,
            })
          );
          setCounter(res.data.result.length);
        })
        .catch((err) => console.log(err));
    }
  }, [user._id]);

  const incrementCounter = () => {
    let counterObj = JSON.parse(localStorage.getItem("counters"));
    counterObj.counter = counter + 1;
    localStorage.setItem("counters", JSON.stringify(counterObj));
    setCounter((prev) => prev + 1);
  };

  if (isLoading && !httpError) {
    return (
      <div className="spreadsheet__loader">
        <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && httpError) {
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  } else if (carrier === null)
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "green" }}>No more Carriers.</h2>
        <p style={{ fontSize: "18px", marginBottom: "4px" }}>
          Possible reasons:
        </p>
        <p style={{ margin: 0 }}>1. Current query returned no result.</p>
        <p>2. No callable carriers right now.</p>
      </div>
    );

  return (
    <div className="row justify-content-center ">
      <div className="col-5">
        <DialerCard
          title={carrier.company_name}
          buttons={[
            {
              buttonText: "Rejected",
              color: "red",
              onClick: buttonrClickHandler,
            },
            {
              buttonText: "Didn't Pick",
              onClick: didnotPickHandler,
              disabled: loading,
            },
            {
              buttonText: "Appointment",
              onClick: buttonClickHandler,
              color: "green",
            },
          ]}
        >
          <Row className="justify-content-between">
            <Col md={5}>
              <h5>Mc:</h5>
            </Col>
            <Col>
              <h6>{carrier.mc_number}</h6>
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col md={5}>
              <h5>Phone:</h5>
            </Col>
            <Col>
              <h6> {carrier.phone_number} </h6>
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col md={5}>
              <h5>Email:</h5>
            </Col>
            <Col className="text-break" md={7}>
              <h6> {carrier.email} </h6>
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col md={5}>
              <h5>Address: </h5>
            </Col>
            <Col>
              <h6>{carrier.address}</h6>
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col md={5}>
              <h5>DBA Name: </h5>
            </Col>
            <Col>
              <h6>{carrier.dba_name ? carrier.dba_name : "N/A"}</h6>
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col md={5}>
              <h5>Power Units: </h5>
            </Col>
            <Col>
              <h6>{carrier.power_units ? carrier.power_units : "N/A"}</h6>
            </Col>
          </Row>

          {carrier.cargo_carried && (
            <>
              <h5>Cargo Carried: </h5>
              <Row className="tags-wrapper">
                {carrier.cargo_carried.map((cargo) => {
                  return <Col className="tags">{cargo}</Col>;
                })}
              </Row>
            </>
          )}
        </DialerCard>
        <div
          className="row
        justify-content-center align-items-center mt-5"
        >
          <div className="col-6">
            <div
              className="card"
              style={{ width: "160px", marginLeft: "2.7vw" }}
            >
              <h2 className="justify-content-center align-items-center">
                <i className="bx bxs-phone-outgoing"> :</i>{" "}
                <span>{counter}</span>{" "}
              </h2>
            </div>
          </div>
        </div>
        {/* {modal && ( */}
        <Modal
          show={modal}
          heading="Make Appointment"
          disabled={loading}
          onConfirm={onConfirm}
          onClose={onClose}
        >
          <form action="">
            <Input
              type="datetime-local"
              label="Call back time:"
              defaultValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
              ref={appointmentRef}
            />
            <TextArea
              name="Comment:"
              placeholder="Comment here..."
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
        {/* )} */}
        <Modal
          show={rmodal}
          heading="Reject Carrier"
          onConfirm={onrConfirm}
          disabled={loading}
          onClose={onrClose}
        >
          <form>
            {options.map((option, index) => {
              return (
                <div className="my-3 align-items-center d-flex">
                  <input
                    type="radio"
                    style={{
                      height: "25px",
                      width: "25px",
                    }}
                    checked={defaultComment?.index === index}
                    onChange={(e) => handleChange(option.value, index)}
                  />
                  <label
                    onClick={(e) => handleChange(option.value, index)}
                    className="mx-3"
                  >
                    {option.label}
                  </label>
                </div>
              );
            })}
            <TextArea
              name="Comment:"
              style={{
                display:
                  defaultComment?.index === options.length - 1 ? "" : "none",
              }}
              placeholder="Comment here..."
              ref={commentrRef}
              value={defaultComment?.text}
              onChange={(e) =>
                setDefaultComment({ ...defaultComment, text: e.target.value })
              }
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
      </div>
    </div>
  );
};

export default Dialer;

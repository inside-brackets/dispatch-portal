import React, { useState, useEffect, useRef } from "react";
import DialerCard from "../../components/cards/Card";
import Modal from "../../components/modals/MyModal";
import Input from "../../components/UI/MyInput";
import Loader from "react-loader-spinner";
import useHttp from "../../hooks/use-https";
import { useSelector } from "react-redux";
import moment from "moment";

import TextArea from "../../components/UI/TextArea";

const Dialer = () => {
  const { user } = useSelector((state) => state.user);
  const appointmentRef = useRef();
  const commentRef = useRef();
  const commentrRef = useRef();
  const [rmodal, setrModal] = useState();
  const [modal, setModal] = useState();
  const [carrier, setCarrier] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();
  const { sendRequest: postCarriers } = useHttp();
  const { sendRequest: postdidnotPickCarriers } = useHttp();

  const { sendRequest: postrejectCarriers } = useHttp();

  // make appointment
  const onConfirm = async () => {
    setLoading(true);
    incrementCounter();
    const transformData = (data) => {
      console.log(data);
      setrefresh(!refresh);
      setModal(false);
    };
    await postCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        body: {
          c_status: "appointment",
          comment: commentRef.current.value,
          appointment: new Date(appointmentRef.current.value),
        },
      },
      transformData
    );
    setLoading(false);
  };

  const didnotPickHandler = async () => {
    setLoading(true);
    incrementCounter();
    const transformData = (data) => {
      console.log(data);
      setrefresh(!refresh);
    };
    await postdidnotPickCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        body: {
          c_status: "didnotpick",
        },
      },
      transformData
    );
    setLoading(false);
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
        url: `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        body: {
          c_status: "rejected",
          comment: commentrRef.current.value,
        },
      },
      transformData
    );
    setLoading(false);
  };

  const buttonrClickHandler = () => {
    setrModal(true);
    setLoading(false);
  };

  // fetch new
  useEffect(() => {
    fetchCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/sales/fetchlead`,
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
    }

    const timer = setTimeout(() => {
      let temp = new Date();
      let reset = new Date(temp.setDate(temp.getDate() + 1)).setHours(17, 0, 0);

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
  }, []);

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
        <h2 style={{ color: "green" }}>No more carriers to show.</h2>
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
          <h5>Mc:</h5> <h6>{carrier.mc_number}</h6>
          <h5>Phone:</h5>
          <h6> {carrier.phone_number} </h6>
          <h5>Email:</h5>
          <h6> {carrier.email} </h6>
          <h5>Address: </h5>
          <h6>{carrier.address}</h6>
        </DialerCard>
        <div
          className="row
        justify-content-center align-items-center mt-5"
        >
          <div className="col-6">
            <div className="card" style={{ width: "160px" }}>
              <h2 className="justify-content-center align-items-center">
                <i class="bx bxs-phone-outgoing"> :</i> <span>{counter}</span>{" "}
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
            <TextArea
              name="Comment:"
              placeholder="Comment here..."
              ref={commentrRef}
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

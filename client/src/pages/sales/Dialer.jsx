import React, { useState, useEffect, useRef } from "react";
import DialerCard from "../../components/cards/Card";
import Modal from "../../components/modals/MyModal";
import Input from "../../components/UI/MyInput";
import Loader from "react-loader-spinner";
import useHttp from "../../hooks/use-https";
import { useSelector } from "react-redux";
import moment from "moment";

import TextArea from "../../components/UI/TextArea";
import { incrementCounter } from "../../utils/utils";

const Dialer = () => {
  const { user } = useSelector((state) => state.user);
  const appointmentRef = useRef();
  const commentRef = useRef();
  const commentrRef = useRef();
  const [rmodal, setrModal] = useState();
  const [modal, setModal] = useState();
  const [carrier, setCarrier] = useState(null);
  const [refresh, setrefresh] = useState(false);
  const [loading, setLoading] = useState(false)
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();
  let counter = JSON.parse(localStorage.getItem("counters"));
  const { sendRequest: postCarriers } = useHttp();
  const { sendRequest: postdidnotPickCarriers } = useHttp();

  const { sendRequest: postrejectCarriers } = useHttp();

  // make appointment
  const onConfirm =async ()  => {
    setLoading(true)
    incrementCounter();
    const transformData = (data) => {
      console.log(data);
      setrefresh(!refresh);
      setModal(false);
    };
await    postCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        body: {
          c_status: "appointment",
          comment: commentRef.current.value,
          appointment:new Date(appointmentRef.current.value),
        },
      },
      transformData
    );
    setLoading(false)
  };

  const didnotPickHandler = async () => {
    setLoading(true)
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
  setLoading(false)
  };
  const buttonClickHandler = () => {
    setModal(true);
  };

  const onClose = () => {
    setModal(false);
    setLoading(false)
  };
  const onrClose = () => {
    setrModal(false);
    setLoading(false)
  };

  // reject
  const onrConfirm = async () => {
    setLoading(true)
    incrementCounter();
    const transformData = (data) => {
      setrefresh(!refresh);
      setrModal(false);
    };
await    postrejectCarriers(
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
    setLoading(false)
  };

  const buttonrClickHandler = () => {
    setrModal(true);
    setLoading(false)
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
            { buttonText: "Didn't Pick", onClick: didnotPickHandler, disabled:loading },
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
            <h2>Fetch Counter : <span>{counter ? counter.counter : 0}</span> </h2>
            <h4></h4>
            
            {/* <input
              className="form-control"
              defaultValue={counter ? counter.counter : 0}
              type="text"
              readOnly
            /> */}
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

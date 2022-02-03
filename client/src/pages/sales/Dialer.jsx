import React, { useState, useEffect, useRef } from "react";
import DialerCard from "../../components/cards/Card";
import Modal from "../../components/modals/MyModal";
import Input from "../../components/UI/MyInput";
import Loader from "react-loader-spinner";
import useHttp from "../../hooks/use-https";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";

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
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();

  const { sendRequest: postCarriers } = useHttp();
  const { sendRequest: postdidnotPickCarriers } = useHttp();

  const { sendRequest: postrejectCarriers } = useHttp();

  const onConfirm = () => {
    const transformData = (data) => {
      console.log(data);
      setrefresh(!refresh);
      setModal(false);
    };
    postCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        body: {
          c_status: "appointment",
          comment: commentRef.current.value,
          appointment: appointmentRef.current.value,
        },
      },
      transformData
    );
  };
  const didnotPickHandler = async () => {
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
    // await axios.put(
    //   `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
    //   {
    //     c_status: "didnotpick",
    //   }
    // );
    // transformData();
  };
  const buttonClickHandler = () => {
    setModal(true);
  };

  const onClose = () => {
    setModal(false);
  };
  const onrClose = () => {
    setrModal(false);
  };

  const onrConfirm = () => {
    const transformData = (data) => {
      console.log(data);
      setrefresh(!refresh);
      setrModal(false);
    };
    postrejectCarriers(
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
  };

  const buttonrClickHandler = () => {
    setrModal(true);
  };
  console.log(user);
  useEffect(() => {
    const transformData = (data) => {
      setCarrier(data);
    };
    fetchCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/sales/fetchlead`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          _id: user._id,
        },
      },
      transformData
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
    <div className="row dialer__container">
      <div className="col-6">
        <DialerCard
          title={carrier.company_name}
          buttons={[
            {
              buttonText: "rejected",
              color: "red",
              onClick: buttonrClickHandler,
            },
            { buttonText: "Didn't Pick", onClick: didnotPickHandler },
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

        {/* {modal && ( */}
        <Modal
          show={modal}
          heading="Make Appointment"
          onConfirm={onConfirm}
          onClose={onClose}
        >
          <form action="">
            <Input
              type="datetime-local"
              label="Call back time:"
              defaultValue={moment(new Date()).format("llll")}
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

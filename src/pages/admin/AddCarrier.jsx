import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import Card from "../../components/cards/Card";
import Input from "../../components/UI/MyInput";
import TruckTable from "../../components/table/TruckTable";
import Button from "../../components/UI/MyButton";
import Modal from "../../components/modals/MyModal";
import ModalToAssignSale from "../../components/modals/ModalToAssignSale";
import TextArea from "../../components/UI/TextArea";
import useHttp from "../../hooks/use-https";
import Loader from "react-loader-spinner";
import BackButton from "../../components/UI/BackButton";
import MySelect from "../../components/UI/MySelect";
import axios from "axios";
import useInput from "../../hooks/use-input";
import Select from "react-select";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";

const isNotEmpty = (value) => value.trim() !== "";

const AppointmentDetail = () => {
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedSalesperson, setSelectedSalesperson] = useState("");
  const appointmentRef = useRef();
  const commentedRef = useRef();
  const [buttonLoader, setButtonLoader] = useState(false);
  const { company } = useSelector((state) => state.user);
  const [salesperson, setSalesperson] = useState();
  const commentRef = useRef();
  const ownerNameRef = useRef();
  const mcRef = useRef();
  const noaRef = useRef();
  const w9Ref = useRef();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [trucks, setTrucks] = useState([]);
  const history = useHistory();
  const params = useParams();
  const [carrier, setCarrier] = useState({});
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [ShowCloseModalPoint, setShowCloseModalPoint] = useState(false);
  const { isLoading, error: httpError, sendRequest: fetchCarrier } = useHttp();
  const { sendRequest: updateCarrier } = useHttp();
  const {
    value: taxId,
    isValid: taxIdIsValid,
    hasError: taxIdHasError,
    valueChangeHandler: taxIdChangeHandler,
    inputBlurHandler: taxIdBlurHandler,
  } = useInput(isNotEmpty);

  // const insCompNameRef = useRef();
  const {
    value: insCompName,
    isValid: insCompNameIsValid,
    hasError: insCompNameHasError,
    valueChangeHandler: insCompNameChangeHandler,
    inputBlurHandler: insCompNameBlurHandler,
  } = useInput(isNotEmpty);

  // const insAddressRef = useRef();

  const {
    value: insAddress,
    isValid: insAddressIsValid,
    hasError: insAddressHasError,
    valueChangeHandler: insAddressChangeHandler,
    inputBlurHandler: insAddressBlurHandler,
  } = useInput(isNotEmpty);

  // const insPhoneRef = useRef();
  const {
    value: insPhone,
    isValid: insPhoneIsValid,
    hasError: insPhoneHasError,
    valueChangeHandler: insPhoneChangeHandler,
    inputBlurHandler: insPhoneBlurHandler,
  } = useInput(isNotEmpty);

  // const insAgentNameRef = useRef();
  const {
    value: insAgentName,
    isValid: insAgentNameIsValid,
    hasError: insAgentNameHasError,
    valueChangeHandler: insAgentNameChangeHandler,
    inputBlurHandler: insAgentNameBlurHandler,
  } = useInput(isNotEmpty);

  // const insAgentEmailRef = useRef();
  const {
    value: insAgentEmail,
    isValid: insAgentEmailIsValid,
    hasError: insAgentEmailHasError,
    valueChangeHandler: insAgentEmailChangeHandler,
    inputBlurHandler: insAgentEmailBlurHandler,
  } = useInput(isNotEmpty);

  const factCompNameRef = useRef();
  // const feeRef = useRef();
  const {
    value: fee,
    isValid: feeIsValid,
    hasError: feeHasError,
    valueChangeHandler: feeChangeHandler,
    inputBlurHandler: feeBlurHandler,
  } = useInput(isNotEmpty);

  const factAddressRef = useRef();
  const factPhoneRef = useRef();
  const factAgentNameRef = useRef();
  const factAgentEmailRef = useRef();
  const carrierEmailRef = useRef();

  const insuranceRef = useRef();

  const {
    value: insurance,
    isValid: insuranceIsValid,
    hasError: insuranceHasError,
    valueChangeHandler: insuranceChangeHandler,
    inputBlurHandler: insuranceBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: mc,
    isValid: mcIsValid,
    hasError: mcHasError,
    valueChangeHandler: mcChangeHandler,
    inputBlurHandler: mcBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: w9,
    isValid: w9IsValid,
    hasError: w9HasError,
    valueChangeHandler: w9ChangeHandler,
    inputBlurHandler: w9BlurHandler,
  } = useInput(isNotEmpty);

  useEffect(() => {
    axios
      .post(`/getusers`, {
        company: company.value,
        department: "sales",
      })
      .then(({ data }) => {
        setSalesperson(data);
      });
  }, [company.value]);

  useEffect(() => {
    axios
      .put(`/updatecarrier/${params.mc}`, {
        c_status: "inprogress",
      })
      .then(({ data }) => {
        setCarrier(data);
        setTrucks(data.trucks);
        if (data.tax_id_number) {
          taxIdChangeHandler({
            target: { value: `${data.tax_id_number}` },
          });
        }
        if (data.dispatcher_fee) {
          feeChangeHandler({
            target: { value: `${data.dispatcher_fee}` },
          });
        }
        setSelectedPayment({
          label: data.payment_method,
          value: data.payment_method,
        });

        if (data.insurance) {
          insPhoneChangeHandler({
            target: {
              value: `${data.insurance.phone_number}`,
            },
          });
          feeChangeHandler({
            target: { value: `${data.dispatcher_fee}` },
          });
          insCompNameChangeHandler({
            target: { value: `${data.insurance.name}` },
          });
          insAddressChangeHandler({
            target: { value: `${data.insurance.address}` },
          });
          insAgentNameChangeHandler({
            target: { value: `${data.insurance.agent_name}` },
          });
          insAgentEmailChangeHandler({
            target: { value: `${data.insurance.agent_email}` },
          });
        }
      });
  }, [
    feeChangeHandler,
    fetchCarrier,
    insAddressChangeHandler,
    insAgentEmailChangeHandler,
    insAgentNameChangeHandler,
    insCompNameChangeHandler,
    insPhoneChangeHandler,
    params.mc,
    taxIdChangeHandler,
  ]);

  const closeCloseModel = () => {
    setShowCloseModal(false);
  };
  const showCloseModalHandler = () => {
    saveCarrier();
    setShowCloseModal(true);
  };
  const showCloseModalPointHandler = () => {
    // saveCarrier();
    setShowCloseModalPoint(true);
  };

  const saveCarrier = () => {
    const upObj = {
      comment: commentRef.current.value,
      owner_name: ownerNameRef.current.value,
      tax_id_number: taxId,
      payment_method: selectedPayment.value,
      email: carrierEmailRef.current.value,
      insurance: {
        name: insCompName,
        address: insAddress,
        phone_no: insPhone,
        agent_name: insAgentName,
        agent_email: insAgentEmail,
      },
    };
    if (factCompNameRef.current) {
      upObj["factoring"] = {
        name: factCompNameRef.current.value,
        address: factAddressRef.current.value,
        phone_no: factPhoneRef.current.value,
        agent_name: factAgentNameRef.current.value,
        agent_email: factAgentEmailRef.current.value,
      };
    }
    if (fee) {
      upObj["dispatcher_fee"] = fee;
    } else {
      upObj["dispatcher_fee"] = 0;
    }
    const transformData = (data) => {};
    updateCarrier(
      {
        url: `/updatecarrier/${carrier.mc_number}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: upObj,
      },
      transformData
    );
  };
  let modalFormIsValid = false;
  if (mcIsValid && w9IsValid && insuranceIsValid && selectedSalesman) {
    modalFormIsValid = true;
  }

  const closeSale = async () => {
    if (!modalFormIsValid) {
      return;
    }
    setButtonLoader(true);
    const files = {
      mc_file: mcRef.current.files[0],
      insurance_file: insuranceRef.current.files[0],
      noa_file: noaRef.current.files[0] ? noaRef.current.files[0] : "",
      w9_file: w9Ref.current.files[0],
    };

    for (const property in files) {
      if (files[property]) {
        const { data: url } = await axios(
          `/s3url/carrier_documents/${carrier.mc_number}-${files[property].name}`
        );
        axios.put(url, files[property]);
        files[property] = url.split("?")[0];
      }
    }
    await axios.put(`/updatecarrier/${carrier.mc_number}`, {
      c_status: "registered",
      salesman: selectedSalesman.value,
      ...files,
    });

    setShowCloseModal(false);
    history.push("/searchcarrier");
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
  }
  const onClose = () => {
    setShowCloseModalPoint(false);
  };
  const onConfirm = async () => {
    setShowCloseModalPoint(false);
    await axios.put(`/updatecarrier/${carrier.mc_number}`, {
      c_status: "appointment",
      salesman: selectedSalesperson.value,
      comment: commentedRef.current.value,
      appointment: new Date(appointmentRef.current.value),
    });
    return toast.success("Carrier Assigned to Sale Person");
  };

  // submit
  let formIsValid = false;
  if (
    taxIdIsValid &&
    feeIsValid &&
    insAgentNameIsValid &&
    insPhoneIsValid &&
    insCompNameIsValid &&
    insAgentEmailIsValid &&
    insAddressIsValid &&
    trucks &&
    trucks.length !== 0
  ) {
    formIsValid = true;
  }
  return (
    <>
      <BackButton onClick={() => history.push("/searchcarrier")} />
      <div className="row justify-content-center align-items-center">
        <div className="col-11">
          <Card
            title={carrier.company_name}
            className="appointment__detail"
            buttons={[
              {
                buttonText: "Registered",
                color: "green",
                onClick: showCloseModalHandler,
                disabled: !formIsValid,
              },
              {
                buttonText: "Appointment",
                color: "green",
                onClick: showCloseModalPointHandler,
                // disabled: !formIsValid,
              },
            ]}
          >
            <div
              className="row"
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <div className="col-1">
                <h4>MC:</h4>
              </div>
              <div className="col-5">
                <h4>{carrier.mc_number}</h4>
              </div>
              <div className="col-2">
                <h4>Phone no:</h4>
              </div>
              <div className="col-4">
                <h5>{carrier.phone_number}</h5>
              </div>
            </div>
            <div
              className="row"
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <div className="col-1">
                <h4>Email:</h4>
              </div>
              <div className="col-5">
                <Input
                  style={{ marginTop: "-10px" }}
                  type="text"
                  ref={carrierEmailRef}
                  defaultValue={carrier.email}
                />
              </div>
              <div className="col-2">
                <h4>Address:</h4>
              </div>

              <div className="col-4">
                <h5>{carrier.address}</h5>
              </div>
            </div>
            <div className="row">
              <center>
                <div className="col-8">
                  <TextArea
                    style={{ width: "500px" }}
                    placeholder="comment"
                    ref={commentRef}
                    defaultValue={carrier.comment}
                  />
                </div>
              </center>
            </div>
            {/* Carrier Details */}
            <div className="row">
              <div className="col-6">
                <h2>Carrier Details:</h2>

                <form action="">
                  <Input
                    type="text"
                    label="Owner's Name:"
                    placeholder="Enter Name"
                    ref={ownerNameRef}
                    defaultValue={carrier.owner_name}
                  />

                  <Input
                    type="number"
                    label="*Tax ID:"
                    placeholder="Enter 16 Digit code"
                    className={taxIdHasError ? "invalid" : ""}
                    value={taxId}
                    onChange={taxIdChangeHandler}
                    onBlur={taxIdBlurHandler}
                    defaultValue={carrier.tax_id_number}
                  />
                </form>
              </div>
              <div
                className="col-6"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  marginTop: "50px",
                }}
              >
                <MySelect
                  isMulti={false}
                  value={selectedPayment}
                  onChange={setSelectedPayment}
                  label="Payment Method:"
                  options={[
                    { label: "Factoring ", value: "factoring" },
                    { label: "Quickpay ", value: "quickpay" },
                    { label: "Standardpay ", value: "standardpay" },
                  ]}
                />
                <Input
                  type="number"
                  label="*Dispatch Fee:"
                  placeholder="Enter Fee"
                  className={feeHasError ? "invalid" : ""}
                  value={fee}
                  onChange={feeChangeHandler}
                  onBlur={feeBlurHandler}
                  defaultValue={
                    carrier.dispatcher_fee ? carrier.dispatcher_fee : 0
                  }
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <h2>*Insurance Details:</h2>
                <form action="">
                  <Input
                    type="text"
                    label="Company's Name:"
                    placeholder="Enter name"
                    className={insCompNameHasError ? "invalid" : ""}
                    value={insCompName}
                    onChange={insCompNameChangeHandler}
                    onBlur={insCompNameBlurHandler}
                    defaultValue={carrier.insurance && carrier.insurance.name}
                  />
                  <Input
                    type="text"
                    label="Address:"
                    placeholder="Enter Address"
                    className={insAddressHasError ? "invalid" : ""}
                    value={insAddress}
                    onChange={insAddressChangeHandler}
                    onBlur={insAddressBlurHandler}
                    defaultValue={
                      carrier.insurance && carrier.insurance.address
                    }
                  />
                  <Input
                    type="text"
                    label="Phone Number:"
                    placeholder="(000) 000-0000"
                    className={insPhoneHasError ? "invalid" : ""}
                    value={insPhone}
                    onChange={insPhoneChangeHandler}
                    onBlur={insPhoneBlurHandler}
                    defaultValue={
                      carrier.insurance && carrier.insurance.phone_no
                    }
                  />
                  <Input
                    type="text"
                    label="Agent's Name:"
                    placeholder="Enter Agent's Name"
                    className={insAgentNameHasError ? "invalid" : ""}
                    value={insAgentName}
                    onChange={insAgentNameChangeHandler}
                    onBlur={insAgentNameBlurHandler}
                    defaultValue={
                      carrier.insurance && carrier.insurance.agent_name
                    }
                  />
                  <Input
                    type="email"
                    label="Agents's Email:"
                    placeholder="Enter email"
                    className={insAgentEmailHasError ? "invalid" : ""}
                    value={insAgentEmail}
                    onChange={insAgentEmailChangeHandler}
                    onBlur={insAgentEmailBlurHandler}
                    defaultValue={
                      carrier.insurance && carrier.insurance.agent_email
                    }
                  />
                </form>
              </div>
              {selectedPayment.value === "factoring" && (
                <div className="col-6">
                  <h2>Factoring Details:</h2>
                  <form action="">
                    <Input
                      type="text"
                      label="Company's Name:"
                      placeholder="Enter name"
                      ref={factCompNameRef}
                      defaultValue={carrier.factoring && carrier.factoring.name}
                    />
                    <Input
                      type="text"
                      label="Address:"
                      placeholder="Enter Address"
                      ref={factAddressRef}
                      defaultValue={
                        carrier.factoring && carrier.factoring.address
                      }
                    />
                    <Input
                      type="text"
                      label="Phone Number:"
                      placeholder="(000) 000-0000"
                      ref={factPhoneRef}
                      defaultValue={
                        carrier.factoring && carrier.factoring.phone_no
                      }
                    />

                    <Input
                      type="text"
                      label="Agent's Name:"
                      placeholder="Enter Agent's Name"
                      ref={factAgentNameRef}
                      defaultValue={
                        carrier.factoring && carrier.factoring.agent_name
                      }
                    />
                    <Input
                      type="text"
                      label="Agents's Email:"
                      placeholder="Enter email"
                      ref={factAgentEmailRef}
                      defaultValue={
                        carrier.factoring && carrier.factoring.agent_email
                      }
                    />
                  </form>
                </div>
              )}
            </div>
          </Card>
        </div>
        <Modal
          size="lg"
          show={showCloseModal}
          heading="Upload Files*"
          onClose={closeCloseModel}
          style={{ width: "auto" }}
        >
          <div
            className="row"
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <Row>
              <Col>
                <Form.Label>Select Salesman:</Form.Label>
                <Select
                  options={
                    salesperson &&
                    salesperson.map((item) => {
                      return {
                        label: item.user_name, // change later
                        value: item._id,
                      };
                    })
                  }
                  value={selectedSalesman}
                  onChange={setSelectedSalesman}
                  isSearchable={true}
                />
              </Col>
            </Row>
            <br />
            <br />
            <br />
            <br />
            <div className="col-1">
              <h5>MC:</h5>
            </div>
            <div className="col-5">
              <Input
                type="file"
                name="file"
                className={mcHasError ? "invalid" : ""}
                onChange={mcChangeHandler}
                onBlur={mcBlurHandler}
                value={mc}
                ref={mcRef}
              />
            </div>
            <div className="col-2">
              <h5>Insurance Certificate:</h5>
            </div>
            <div className="col-4">
              <Input
                type="file"
                name="file"
                className={insuranceHasError ? "invalid" : ""}
                value={insurance}
                onChange={insuranceChangeHandler}
                onBlur={insuranceBlurHandler}
                ref={insuranceRef}
              />
            </div>
          </div>
          <div
            className="row"
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <div className="col-1">
              {selectedPayment.value === "factoring" ? (
                <h5>NOA:</h5>
              ) : (
                <h5>Void Check</h5>
              )}
            </div>
            <div className="col-5">
              <Input type="file" name="file" ref={noaRef} />
            </div>
            <div className="col-2">
              <h5>W-9 Form:</h5>
            </div>
            <div className="col-4">
              <Input
                type="file"
                name="file"
                className={w9HasError ? "invalid" : ""}
                onChange={w9ChangeHandler}
                onBlur={w9BlurHandler}
                value={w9}
                ref={w9Ref}
              />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              buttonText="Submit"
              color="inherit"
              onClick={closeSale}
              className="button__class"
              disabled={!modalFormIsValid || buttonLoader}
            />
          </div>
        </Modal>

        <ModalToAssignSale
          show={ShowCloseModalPoint}
          heading="Appoint a saleperson"
          onConfirm={onConfirm}
          onClose={onClose}
        >
          <form action="">
            <Row className="justify-content-end my-2">
              <Col md={12}>
                <div className="assign__text">SalesPerson:</div>
                <MySelect
                  value={selectedSalesperson}
                  onChange={setSelectedSalesperson}
                  options={
                    salesperson &&
                    salesperson.map((item) => {
                      return {
                        label: item.user_name, // change later
                        value: item._id,
                      };
                    })
                  }
                />
              </Col>
            </Row>
            <Input
              type="datetime-local"
              label="Call back time:"
              defaultValue={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
              ref={appointmentRef}
            />
            <TextArea
              name="Comment:"
              placeholder="Add a note about this appointment ..."
              ref={commentedRef}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            ></div>
          </form>
        </ModalToAssignSale>
      </div>
      <TruckTable
        mc={carrier.mc_number}
        trucks={trucks}
        setTrucks={setTrucks}
      />
    </>
  );
};

export default AppointmentDetail;

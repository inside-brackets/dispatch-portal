import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {Col, Row, Form, Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import LoadTable from "../../table/LoadTable";
import TextArea from "../../UI/TextArea";
import Modal from "../../modals/MyModal";
import { useHistory } from "react-router-dom";
import MySelect from "../../UI/MySelect";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import "../../../assets/css/dispatch/truckDetail.css";
import {useParams} from "react-router-dom"

const transformToSelectValue = (value) => {
  if (value.constructor === Array) {
    return value.map((item) => ({
      label: `${item.charAt(0).toUpperCase() + item.slice(1)} `,
      value: item.trim(),
    }));
  } else {
    return {
      label: `${value.charAt(0).toUpperCase() + value.slice(1)} `,
      value: value.trim(),
    };
  }
};

const TruckDetails = () => {
  const { _id: currUserId } = useSelector((state) => state.user.user);
  const commentRef = useRef();
  const params=useParams()
  // here
  const dispatcherCommentRef = useRef();
  const [truck, setTruck] = useState("");
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState(null);
  const [rmodal, setrModal] = useState();
  const [ownerName, setOwnerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [carryLimit, setCarryLimit] = useState("");
  const [temperatureRestrictions, setTemperatureRestrictions] = useState("");
  const [tripDurration, setTripDurration] = useState("");
  const [region, setRegion] = useState("");
  const [trailerType, setTrailerType] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [factCompanyName, setFactCompanyName] = useState("");
  const [factAddress, setFactAddress] = useState("");
  const [factPhone, setFactPhone] = useState("");
  const [factAgentName, setFactAgentName] = useState("");
  const [factAgentEmail, setfactAgentEmail] = useState("");
  const [buttonLoader, setButtonLoader] = useState("");
  const [t_status, setT_status] = useState(``);
  const [confirmModal, setconfirmModal] = useState({ value: false, index: 0 });
  const [drivers, setDrivers] = useState([
    {
      name: "",
      email_address: "",
      phone_number: "",
    },
  ]);
  const history = useHistory();

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.post(`/getcarrier`, {
        "trucks.dispatcher": currUserId,
        mc_number: params.mc,/////
      });

      setData(response.data);
      setCompanyName(response.data.company_name);
      setPhoneNumber(response.data.phone_number);
      setEmail(response.data.email);
      setOwnerName(response.data.owner_name);
      if (response.data.insurance) {
        setAddress(response.data.insurance.address);
        setPhone(response.data.insurance.phone_no);
        setAgentName(response.data.insurance.agent_name);
        setAgentEmail(response.data.insurance.agent_email);
      }
      if (response.data.factoring) {
        setFactCompanyName(response.data.factoring.name);
        setFactAddress(response.data.factoring.address);
        setFactAgentName(response.data.factoring.agent_name);
        setFactPhone(response.data.factoring.phone_no);
        setfactAgentEmail(response.data.factoring.agent_email);
      }
      const truck = response.data.trucks.find((item) => {
        return item.truck_number.toString() === params.truck.toString();///
      });
      setTruck(truck);
      setDrivers(truck.drivers);
      setTruckNumber(truck.truck_number);
      setVinNumber(truck.vin_number);
      setCarryLimit(truck.carry_limit);
      setTemperatureRestrictions(truck.temperature_restriction);
      setTripDurration(truck.trip_durration);
      setRegion(transformToSelectValue(truck.region));
      setTrailerType(transformToSelectValue(truck.trailer_type));
      setT_status(transformToSelectValue(truck.t_status));
    };
    fetch();
  }, [currUserId]);////

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      setButtonLoader(true);
      const upObj = {
        comment: commentRef.current.value,
        // here
        dispatcher_comment: dispatcherCommentRef.current.value,
        owner_name: ownerName,
        phone_number: phoneNumber,
        email: email,
        insurance: {
          name: companyName,
          address: address,
          phone_no: phone,
          agent_name: agentName,
          agent_email: agentEmail,
        },
      };
      if (data.payment_method === "factoring") {
        upObj["factoring"] = {};
        upObj["factoring"]["name"] = factCompanyName;
        upObj["factoring"]["address"] = factAddress;
        upObj["factoring"]["agent_name"] = factAgentName;
        upObj["factoring"]["agent_email"] = factAgentEmail;
        upObj["factoring"]["phone_no"] = factPhone;
      }

      await axios
        .put(`/updatecarrier/${data.mc_number}`, upObj)
        .then((response) => {
          toast.success("Carrier Saved", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setData(response.data);
          commentRef.current.value = response.data.comment;
          // here
          dispatcherCommentRef.current.value = response.data.dispatcher_comment;

          setCompanyName(response.data.company_name);
          setAddress(response.data.insurance.address);
          setPhone(response.data.insurance.phone_no);
          setAgentName(response.data.insurance.agent_name);
          setAgentEmail(response.data.insurance.agent_email);
          setButtonLoader(false);
        })
        .catch((err) => {console.log(err);
          setButtonLoader(false);
        });
      const truckObj = {
        "trucks.$.trailer_type": trailerType.value,
        "trucks.$.carry_limit": carryLimit,
        "trucks.$.trip_durration": tripDurration,
        "trucks.$.temperature_restriction": temperatureRestrictions,
        "trucks.$.vin_number": vinNumber,
        "trucks.$.region": region.map((item) => item.value),
        "trucks.$.t_status": t_status.value,
        "trucks.$.drivers": drivers,
      };

      const res = await axios.put(
        `/updatetruck/${data.mc_number}/${params.truck}`,/////
        truckObj
      );
      
      setButtonLoader(false);
    }
  };


  const rejectHandler = async () => {
    await axios.put(`/updatecarrier/${data.mc_number}`, {
      c_status: "deactivated",
      comment: commentRef.current.value,
      dispatcher_comment: dispatcherCommentRef.current.value,
    });
    setrModal(false);
    history.push("/mytrucks");
  };

  // Custom InPuts

  let handleChange = (i, e) => {
    let newFormValues = [...drivers];
    newFormValues[i][e.target.name] = e.target.value;
    setDrivers(newFormValues);
  };
  let addFormFields = () => {
    setDrivers([
      ...drivers,
      {
        name: "",
        email_address: "",
        phone_number: "",
      },
    ]);
  };
  let removeFormFields = (i) => {
    setconfirmModal(confirmModal.value);
    if (confirmModal.value) {
      let newFormValues = [...drivers];
      newFormValues.splice(confirmModal.index, 1);
      setDrivers(newFormValues);
      setconfirmModal(false);
    }
  };

  const onmClose = () => {
    setconfirmModal({ value: false });
  };

  return (
    <>
      {!data ? (
        <div className="spreadsheet__loader">
          <Loader
            type="MutatingDots"
            color="#349eff"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row style={{marginTop:"23px"}}>
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Row>
                      <Col>
                        {" "}
                        <h3>MC:</h3>{" "}
                      </Col>
                      <Col md={9}>
                        <Form.Control
                          type="text"
                          placeholder="Payment Method"
                          required
                          defaultValue={data.mc_number}
                          disabled
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid MC.
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Row>
                      <Col>
                        {" "}
                        <h3>Address:</h3>{" "}
                      </Col>
                      <Col md={9}>
                        <Form.Control
                          type="text"
                          placeholder="Payment Method"
                          required
                          defaultValue={data.address}
                          disabled
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid entity.
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Form.Group>
                </Row>
                <Row style={{ marginTop: "40px" }}>
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Row>
                      <Col>
                        {" "}
                        <h3>Phone #:</h3>{" "}
                      </Col>
                      <Col md={9}>
                        <Form.Control
                          type="text"
                          placeholder="Phone Number"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid entity.
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Row>
                      <Col>
                        {" "}
                        <h3>Email:</h3>{" "}
                      </Col>
                      <Col md={9}>
                        <Form.Control
                          placeholder="Email"
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid entity.
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Form.Group>
                  {/* <h4>Address: {data.address} </h4> */}
                </Row>

                <Row
                  style={{
                    // justifyContent: "center",
                    marginTop: "40px",
                  }}
                >
                  <Col
                    md={3}
                    style={{
                      justifyContent: "flex-start",
                    }}
                  >
                    <h4> Sales Comments:</h4>
                  </Col>
                  <Col
                    md={6}
                    style={{
                      zIndex: 2,
                    }}
                  >
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <TextArea
                        style={{ width: "500px" }}
                        placeholder="Comment.."
                        defaultValue={data.comment}
                        ref={commentRef}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row
                  style={{
                    marginTop: "40px",
                  }}
                >
                  <Col
                    md={3}
                    style={{
                      justifyContent: "flex-start",
                    }}
                  >
                    <h4>Dispatcher Comments:</h4>
                  </Col>
                  <Col
                    md={6}
                    style={{
                      zIndex: 1,
                    }}
                  >
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <TextArea
                        style={{ width: "500px" }}
                        placeholder="Dispatcher's Comments"
                        // value={comment}
                        defaultValue={data.dispatcher_comment}
                        // onChange={(e) => setDispatcherComment(e.target.value)}
                        ref={dispatcherCommentRef}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h2>Carrier Details :</h2>

                <Row className="m-3">
                  <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Owner Name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Owner Name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid entity.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Col></Col>
                    <Form.Group as={Col} md="3" controlId="validationCustom05">
                      <Form.Label>Payment Method:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Payment Method"
                        required
                        defaultValue={data.payment_method}
                        disabled
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid entity.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="my-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Tax Id:</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Tax Id"
                        disabled
                        defaultValue={data.tax_id_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Tax Id.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <h2>Insurance Details:</h2>
                  <Row className="my-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Company's Name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Company's Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Company's Name.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Address:</Form.Label>
                      <Form.Control
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Address.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="my-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Agent's Name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Agent's Name"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Agent's Name.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Agent's Email:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Agent's Email"
                        value={agentEmail}
                        onChange={(e) => setAgentEmail(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Agent's Email.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Phone Number:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Phone Number.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  {data.payment_method === "factoring" ? (
                    <div>
                      <h2>Factoring Details:</h2>
                      <Row className="my-3">
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Company's Name:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Company's Name"
                            value={factCompanyName}
                            onChange={(e) => setFactCompanyName(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid Company's Name.
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Address:</Form.Label>
                          <Form.Control
                            type="text"
                            value={factAddress}
                            onChange={(e) => setFactAddress(e.target.value)}
                            placeholder="Address"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid Address.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="my-3">
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Agent's Name:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Agent's Name"
                            value={factAgentName}
                            onChange={(e) => setFactAgentName(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid Agent's Name.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Agent's Email:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Agent's Email"
                            value={factAgentEmail}
                            onChange={(e) => setfactAgentEmail(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid Agent's Email.
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Phone Number:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Phone Number"
                            value={factPhone}
                            onChange={(e) => setFactPhone(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid Phone Number.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                    </div>
                  ) : null}
                </Row>
                <hr />
                <h3>Truck Details:</h3>
                <Row className="m-3">
                  <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Truck Number:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Agent's Email"
                        value={truckNumber}
                        onChange={(e) => setTruckNumber(e.target.value)}
                        readOnly
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Truck Number.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Vin Number:</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Truck's Vin number"
                        value={vinNumber}
                        onChange={(e) => setVinNumber(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid Vin Number.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Carry Limit:</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Carry limit"
                        value={carryLimit}
                        onChange={(e) => setCarryLimit(e.target.value)}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mt-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Temperature Restrictions:</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Temperature Restrictions"
                        value={temperatureRestrictions}
                        onChange={(e) =>
                          setTemperatureRestrictions(e.target.value)
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Trip Durration:</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Trip duration"
                        value={tripDurration}
                        onChange={(e) => setTripDurration(e.target.value)}
                        // defaultValue={data.tax_id_number}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mt-3">
                    <Col md="4">
                      <MySelect
                        label="Region"
                        isMulti={true}
                        value={region}
                        onChange={setRegion}
                        options={[
                          { label: "Central", value: "central" },
                          { label: "Mountain ", value: "mountain" },
                          { label: "Pacific", value: "pacific" },
                          { label: "Eastern ", value: "eastern" },
                          { label: "Allover ", value: "allover" },
                        ]}
                      />
                    </Col>
                    <Col
                      style={{
                        // marginLeft: "-300px",
                        padding: "0px",
                      }}
                      md="4"
                    >
                      <MySelect
                        label="Trailer Type:"
                        isMulti={false}
                        value={trailerType}
                        onChange={setTrailerType}
                        options={[
                          { label: "Dryvan", value: "dryvan" },
                          { label: "Flatbed ", value: "flatbed" },
                          { label: "Reefer ", value: "reefer" },
                          { label: "Gooseneck ", value: "gooseneck" },
                          { label: "Stepdeck ", value: "stepdeck" },
                          { label: "Lowboy ", value: "lowboy" },
                          { label: "Power Only ", value: "poweronly" },
                          { label: "Box Truck", value: "boxtruck" },
                        ]}
                      />
                    </Col>
                    <Col
                      md={4}
                      style={
                        {
                          // marginLeft: "-300px",
                        }
                      }
                    >
                      <MySelect
                        label="Truck Status:"
                        isMulti={false}
                        value={t_status}
                        onChange={setT_status}
                        isDisabled={t_status.value === "new"}
                        options={[
                          // { label: "New", value: "new" },
                          { label: "Pending", value: "pending" },
                          { label: "Active", value: "active" },
                          { label: "Inactive ", value: "inactive" },
                        ]}
                      />
                    </Col>
                  </Row>
                </Row>
                <hr />
                <h3>Drivers:</h3>
                <Row className="m-3">
                  {drivers.map((element, index) => (
                    <div className="form-inline" key={index}>
                      {/* <Row className="justify-content-end " >
                        <Col md={3}>
                          {drivers.length === 2 && (
                            <i
                              className="bx bx-trash"
                              onClick={() => removeFormFields(index)}
                            ></i>
                          )}
                        </Col>
                      </Row> */}
                      <Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Driver Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Driver Name"
                            required
                            name="name"
                            onChange={(e) => handleChange(index, e)}
                            value={element.name}
                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Driver Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Driver Email"
                            required
                            onChange={(e) => handleChange(index, e)}
                            name="email_address"
                            value={element.email_address}
                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Driver Phone</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Driver Phone"
                            required
                            onChange={(e) => handleChange(index, e)}
                            name="phone_number"
                            value={element.phone_number}
                          />
                        </Form.Group>

                        <Col md={1} className="bx-trashh">
                          {/* {drivers.length === 2 && ( */}
                          <i
                            className="bx bx-x"
                            onClick={() =>
                              setconfirmModal({ value: true, index: index })
                            }
                          ></i>
                          {/* // )} */}
                        </Col>
                      </Row>
                    </div>
                  ))}
                  {drivers.length < 2 ? (
                    <div className="button-section mt-4">
                      <Button type="button" onClick={() => addFormFields()}>
                        Add
                      </Button>
                    </div>
                  ) : null}
                </Row>

                <Modal
                  show={confirmModal.value}
                  heading="Remove Driver"
                  // onConfirm={rejectHandler}
                  onClose={onmClose}
                >
                  <div className="confirmText">Are You Sure!</div>
                  <div className="proceedText">
                    If you proceed, You will lose all driver data. Are You sure
                    do you want to delete your driver information?
                  </div>
                  <div className="buttonWrapper">
                    <Button
                      variant="secondary"
                      onClick={() => setconfirmModal({ value: false })}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => removeFormFields(confirmModal)}
                      disabled={drivers.length === 2 ? false : true}
                    >
                      Confirm
                    </Button>
                  </div>
                </Modal>
                <Row
                  className="justify-content-between"
                  style={{ marginTop: "10px" }}
                >
                  <Col md={6}>
                    <Button
                      disabled={buttonLoader}
                      variant="success"
                      size="lg"
                      type="submit"
                    >
                      {buttonLoader && (
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                      Update Carrier
                    </Button>
                  </Col>
                </Row>
            </Form>
          <Modal
            show={rmodal}
            heading="Reject Carrier"
            onConfirm={rejectHandler}
            onClose={() => {
              setrModal(false);
            }}
          >
            <form>
              <TextArea
                name="Comment:"
                placeholder="Comment here..."
                defaultValue={commentRef.current && commentRef.current.value}
                ref={commentRef}
              />
            </form>
          </Modal>
          <hr/>
          <LoadTable
            className="load_table"
            // style={{width: "98.5%",marginLeft:'11px'}}
            setModal={setrModal}
            truck_number={params.truck}/////
            carrier={data}
            truck={truck}
          />
        </div>
      )}
    </>
  );
};

export default TruckDetails;

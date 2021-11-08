import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import LoadTable from "../../components/table/LoadTable";
import TextArea from "../../components/UI/TextArea";
import Modal from "../../components/modals/MyModal";
import { useHistory } from "react-router-dom";
import MySelect from "../../components/UI/MySelect";
import BackButton from "../../components/UI/BackButton";
import Loader from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";

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

const TruckDetail = ({ match }) => {
  const { _id: currUserId } = useSelector((state) => state.user.user);
  const commentRef = useRef();
  // here
  const dispatcherCommentRef = useRef();
  const [truckObj, setTruckObj] = useState("");
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
  const history = useHistory();

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/getcarrier`,
        {
          "trucks.dispatcher._id": currUserId,
          mc_number: match.params.mc,
        }
      );
      setData(response.data);
      setCompanyName(response.data.company_name);
      setAddress(response.data.insurance.address);
      setPhone(response.data.insurance.phone_no);
      setAgentName(response.data.insurance.agent_name);
      setAgentEmail(response.data.insurance.agent_email);
      setPhoneNumber(response.data.phone_number);
      setEmail(response.data.email);
      setOwnerName(response.data.owner_name);
      if (response.data.factoring) {
        setFactCompanyName(response.data.factoring.name);
        setFactAddress(response.data.factoring.address);
        setFactAgentName(response.data.factoring.agent_name);
        setFactPhone(response.data.factoring.phone_no);
        setfactAgentEmail(response.data.factoring.agent_email);
      }
      const truck = response.data.trucks.find((item) => {
        return item.truck_number.toString() === match.params.truck.toString();
      });
      setTruckObj(truck);
      setTruckNumber(truck.truck_number);
      setVinNumber(truck.vin_number);
      setCarryLimit(truck.carry_limit);
      setTemperatureRestrictions(truck.temperature_restriction);
      setTripDurration(truck.trip_durration);
      setRegion(transformToSelectValue(truck.region));
      setTrailerType(transformToSelectValue(truck.trailer_type));
    };
    fetch();
  }, [currUserId, match]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
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
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${data.mc_number}`,
          upObj
        )
        .then((response) => {
          console.log(response.data);
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
        })
        .catch((err) => console.log(err));
      const truckObj = {
        trailer_type: trailerType.value,
        carry_limit: carryLimit,
        trip_durration: tripDurration,
        temperature_restriction: temperatureRestrictions,
        truck_number: truckNumber,
        vin_number: vinNumber,
        region: region.map((item) => item.value),
      };

      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/dispatch/updatetruck/${data.mc_number}/${match.params.truck}`,
          truckObj
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  };

  const openModal = () => {
    setrModal(true);
  };
  const rejectHandler = async () => {
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${data.mc_number}`,
      {
        c_status: "deactivated",
        comment: commentRef.current.value,
        // here
        dispatcher_comment: dispatcherCommentRef.current.value,
      }
    );
    setrModal(false);
    console.log(commentRef.current.value);
    history.push("/mytrucks");
  };

  return (
    <>
      {!data ? (
        <div className="spreadsheet__loader">
          <Loader type="TailSpin" color="#A9A9A9" height={100} width={100} />
        </div>
      ) : (
        <div>
          <BackButton onClick={() => history.push("/mytrucks")} />

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card
              className="truck-detail-card"
              style={{
                width: "auto",
                height: "auto",
                marginLeft: "60px",
                marginRight: "30px",
              }}
            >
              <Card.Body>
                <h1 className="text-center">{data.company_name}</h1>
                <hr />
                <Row>
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
                  {/* <h4>Address: {data.address} </h4> */}
                </Row>
                {/* <Row style={{ marginTop: "40px" }}>
                  <Col>
                    <h4>Phone No : {data.phone_number}</h4>
                  </Col>
                  <Col>
                    <h4>Email : {data.email.toLowerCase()} </h4>
                  </Col>
                </Row> */}
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
                          placeholder="Payment Method"
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
                    height: "100px",
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
                        // value={comment}
                        defaultValue={data.comment}
                        // onChange={(e) => setComment(e.target.value)}
                        ref={commentRef}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row
                  style={{
                    // justifyContent: "center",
                    marginTop: "40px",
                    height: "100px",
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
                        type="text"
                        placeholder="Tax Id"
                        disabled
                        defaultValue={data.tax_id_number}
                        required
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
                        required
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
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Carry Limit:</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="carry limit"
                        value={carryLimit}
                        onChange={(e) => setCarryLimit(e.target.value)}
                      />
                    </Form.Group>

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
                  </Row>
                  <Row>
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
                  <Row>
                    <Col
                      style={{
                        marginLeft: "-30px",
                      }}
                    >
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
                        marginLeft: "-300px",
                      }}
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
                          { label: "Power Only ", value: "power_only" },
                        ]}
                      />
                    </Col>
                  </Row>
                </Row>
                <hr />
                <h3>Carrier Documents:</h3>
                <Row xs="auto" className="m-3">
                  <Col>
                    {data.insurance_file && data.insurance_file !== "" && (
                      <Button
                        onClick={() => {
                          const pdfWindow = window.open();
                          pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${data.insurance_file}`;
                        }}
                      >
                        Insurance
                      </Button>
                    )}
                  </Col>
                  <Col>
                    {data.noa_file && data.noa_file !== "" && (
                      <Button
                        onClick={() => {
                          const pdfWindow = window.open();
                          pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${data.noa_file}`;
                        }}
                      >
                        NOA/Void Check
                      </Button>
                    )}
                  </Col>
                  <Col>
                    {data.mc_file && data.mc_file !== "" && (
                      <Button
                        onClick={() => {
                          const pdfWindow = window.open();
                          pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${data.mc_file}`;
                        }}
                      >
                        MC Authority
                      </Button>
                    )}
                  </Col>
                  <Col>
                    {data.w9_file && data.w9_file !== "" && (
                      <Button
                        onClick={() => {
                          const pdfWindow = window.open();
                          pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${data.w9_file}`;
                        }}
                      >
                        W9
                      </Button>
                    )}
                  </Col>
                </Row>
                <Row
                  className="justify-content-between"
                  style={{ marginTop: "10px" }}
                >
                  <hr />
                  <Col md={6}>
                    <Button variant="success" size="lg" type="submit">
                      Update Carrier
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      style={{ float: "right" }}
                      size="lg"
                      variant="danger"
                      onClick={openModal}
                    >
                      Deactivate Carrier
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
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
          <LoadTable
            setModal={setrModal}
            truck_number={match.params.truck}
            carrier={data}
            truck={truckObj}
          />
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default TruckDetail;

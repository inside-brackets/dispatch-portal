import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import TruckTable from "../../components/table/TruckTable";
import TextArea from "../../components/UI/TextArea";
import Loader from "react-loader-spinner";
import BackButton from "../../components/UI/BackButton";
import Modal from "../../components/modals/MyModal";
import axios from "axios";
import { Form, Card, Row, Col, Button } from "react-bootstrap";

const AppointmentDetail = () => {
  // const [selectedPayment, setSelectedPayment] = useState("");
  const [trucks, setTrucks] = useState([]);

  const history = useHistory();
  const params = useParams();
  const [carrier, setCarrier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rmodal, setrModal] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getcarrier`, {
        mc_number: params.mc,
      })
      .then(({ data }) => {
        console.log("carrier", data);
        if (data) {
          setCarrier(data);
          setTrucks(data.trucks);
          // setSelectedPayment({
          //   label: data.payment_method,
          //   value: data.payment_method,
          // });
          setTrucks(data.trucks);
          // setSelectedPayment({
          //   label: data.payment_method,
          //   value: data.payment_method,
          // });
        } else {
          setError(true);
        }
        setIsLoading(false);
      });
  }, [params.mc]);
  const openModal = () => {
    setrModal(true);
  };

  const rejectHandler = async () => {
    setrModal(false);
  };

  if (isLoading && !error) {
    return (
      <div className="spreadsheet__loader">
        <Loader type="TailSpin" color="#A9A9A9" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && error) {
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col">
        <BackButton onClick={() => history.push("/searchcarrier")} />
        <Form
          noValidate
          // validated={validated} onSubmit={handleSubmit}
        >
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
              <h1 className="text-center">{carrier.company_name}</h1>
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
                        defaultValue={carrier ? carrier.mc_number : false}
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
                        defaultValue={carrier ? carrier.address : false}
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
                        // value={phoneNumber}
                        // onChange={(e) => setPhoneNumber(e.target.value)}
                        defaultValue={carrier ? carrier.phone_number : false}
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
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        defaultValue={carrier ? carrier.email : false}
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
                      defaultValue={carrier ? carrier.comment : false}
                      // ref={commentRef}
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
                      defaultValue={
                        carrier ? carrier.dispatcher_comment : false
                      }
                      // onChange={(e) => setDispatcherComment(e.target.value)}
                      // ref={dispatcherCommentRef}
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
                      // value={ownerName}
                      // onChange={(e) => setOwnerName(e.target.value)}
                      defaultValue={carrier ? carrier.owner_name : false}
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
                      defaultValue={carrier ? carrier.payment_method : false}
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
                      defaultValue={carrier ? carrier.tax_id_number : false}
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
                      // value={companyName}
                      // onChange={(e) => setCompanyName(e.target.value)}
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.name
                          : false
                      }
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
                      // value={address}
                      // onChange={(e) => setAddress(e.target.value)}
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.address
                          : false
                      }
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
                      // value={agentName}
                      // onChange={(e) => setAgentName(e.target.value)}
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.agent_name
                          : false
                      }
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
                      // value={agentEmail}
                      // onChange={(e) => setAgentEmail(e.target.value)}
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.agent_email
                          : false
                      }
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
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.phone_no
                          : false
                      }
                      // value={phone}
                      // onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid Phone Number.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {carrier.payment_method === "factoring" ? (
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
                          // value={factCompanyName}
                          // onChange={(e) => setFactCompanyName(e.target.value)}
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.name
                              : false
                          }
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
                          // value={factAddress}
                          // onChange={(e) => setFactAddress(e.target.value)}
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.address
                              : false
                          }
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
                          // value={factAgentName}
                          // onChange={(e) => setFactAgentName(e.target.value)}
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.agent_name
                              : false
                          }
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
                          // value={factAgentEmail}
                          // onChange={(e) => setfactAgentEmail(e.target.value)}
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.agent_email
                              : false
                          }
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
                          // value={factPhone}
                          // onChange={(e) => setFactPhone(e.target.value)}
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.phone_no
                              : false
                          }
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
              <h3>Carrier Documents:</h3>
              <Row xs="auto" className="m-3">
                <Col>
                  {carrier &&
                    carrier.insurance_file &&
                    carrier.insurance_file !== "" && (
                      <Button
                        onClick={() => {
                          const pdfWindow = window.open();
                          pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${carrier.insurance_file}`;
                        }}
                      >
                        Insurance
                      </Button>
                    )}
                </Col>
                <Col>
                  {carrier && carrier.noa_file && carrier.noa_file !== "" && (
                    <Button
                      onClick={() => {
                        const pdfWindow = window.open();
                        pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${carrier.noa_file}`;
                      }}
                    >
                      NOA/Void Check
                    </Button>
                  )}
                </Col>
                <Col>
                  {carrier && carrier.mc_file && carrier.mc_file !== "" && (
                    <Button
                      onClick={() => {
                        const pdfWindow = window.open();
                        pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${carrier.mc_file}`;
                      }}
                    >
                      MC Authority
                    </Button>
                  )}
                </Col>
                <Col>
                  {carrier && carrier.w9_file && carrier.w9_file !== "" && (
                    <Button
                      onClick={() => {
                        const pdfWindow = window.open();
                        pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${carrier.w9_file}`;
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
              // defaultValue={commentRef.current && commentRef.current.value}
              // ref={commentRef}
            />
          </form>
        </Modal>

        <TruckTable
          mc={carrier.mc_number}
          trucks={trucks}
          setTrucks={setTrucks}
        />
      </div>
    </div>
  );
};

export default AppointmentDetail;

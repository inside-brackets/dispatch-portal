import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import TruckTable from "../../table/TruckTable";
import TextArea from "../../UI/TextArea";
import Loader from "react-loader-spinner";
import Modal from "../../modals/MyModal";
import axios from "axios";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import MySelect from "../../UI/MySelect";
import { socket } from "../../../index";
import { useSelector } from "react-redux";
import "./carrierdetail.css";
import moment from "moment";
import NewSalePDF from "../../createPdf/NewSalePDF";
import { useReactToPrint } from "react-to-print";

const CarrierDetails = ({ carrierData }) => {
  const currUser = useSelector((state) => state.user.user);
  const { company } = useSelector((state) => state.user);
  const [trucks, setTrucks] = useState([]);
  const history = useHistory();
  const params = useParams();
  const [carrier, setCarrier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dModal, setdModal] = useState();
  const [printModal, setPrintModal] = useState();
  const [error, setError] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loaderButton, setLoaderButton] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [closeCheck, setCloseCheck] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [statusChanged, setStatusChanged] = useState();
  const [salesperson, setSalesperson] = useState();
  const [selectedCarrierStatus, setSelectedCarrierStatus] = useState("");
  const [selectedSalesperson, setSelectedSalesperson] = useState();

  const ref = useRef();
  const reactToPrintContent = React.useCallback(() => {
    return ref.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    removeAfterPrint: true,
  });

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    axios
      .post(`/getcarrier`, {
        mc_number: params.mc,
      })
      .then(({ data }) => {
        setIsLoading(false);
        if (data) {
          setCarrier(data);
          setTrucks(data.trucks);
          setSelectedPayment({
            label:
              data.payment_method.charAt(0).toUpperCase() +
              data.payment_method.slice(1),
            value: data.payment_method,
          });
          setSelectedCarrierStatus({
            label:
              data.c_status.charAt(0).toUpperCase() + data.c_status.slice(1),
            value: data.c_status,
          });
          setSelectedSalesperson({
            label: data.salesman
              ? data.salesman.user_name
              : "Select Salesperson:",
            value: data.salesman?._id,
          });
        } else {
          setError(true);
        }
      });
  }, [params.mc]);

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
    if (carrierData) {
      setCarrier(carrierData);
    }
  }, [carrierData]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(currUser.department === "admin")) {
      if (closeCheck && form.checkValidity()) {
        setSelectedCarrierStatus({ label: "Registered", value: "registered" });
      } else {
        setSelectedCarrierStatus({
          label:
            carrier.c_status.charAt(0).toUpperCase() +
            carrier.c_status.slice(1),
          value: carrier.c_status,
        });
      }
    }
    const bypass = selectedCarrierStatus.value !== "registered";
    if (bypass || form.checkValidity() === true) {
      setLoaderButton(true);
      const upObj = {
        owner_name: event.target.owner_name.value,
        phone_number: event.target.phone_number.value,
        email: event.target.email.value,
        tax_id_number: event.target.tax_id.value,
        dispatcher_fee: event.target.dispatch_fee.value,
        appointment: new Date(event.target.appointment.value),
        insurance: {
          name: event.target.i_company_name.value,
          address: event.target.i_address.value,
          phone_no: event.target.i_phone_number.value,
          agent_name: event.target.i_agent_name.value,
          agent_email: event.target.i_agent_email.value,
        },
      };
      if (currUser.department === "admin") {
        upObj["salesman"] = selectedSalesperson?.value;
      }
      if (selectedCarrierStatus.value === "registered") {
        if (
          !carrier.mc_file ||
          !carrier.noa_file ||
          !carrier.w9_file ||
          !carrier.insurance_file
        ) {
          toast.warn("Upload Files");
          setLoaderButton(false);
          setCloseCheck(false);
          return;
        }
        axios
          .post(`/getcarrier`, {
            mc_number: params.mc,
          })
          .then(({ data }) => {
            if (data) {
              setTrucks(data.trucks);
            }
          });
        if (!(trucks.length >= 1)) {
          toast.warn("Add Truck");
          setLoaderButton(false);
          return;
        }
      }
      if (closeCheck) {
        upObj["c_status"] = "registered";
      }
      if (statusChanged) {
        upObj["c_status"] = selectedCarrierStatus.value;
      }

      if (selectedPayment.value === "factoring") {
        upObj["payment_method"] = selectedPayment.value;
        upObj["factoring"] = {};
        upObj["factoring"]["name"] = event.target.f_name.value;
        upObj["factoring"]["address"] = event.target.f_address.value;
        upObj["factoring"]["agent_name"] = event.target.f_agent_name.value;
        upObj["factoring"]["agent_email"] = event.target.f_agent_email.value;
        upObj["factoring"]["phone_no"] = event.target.f_phone.value;
      } else {
        upObj["payment_method"] = selectedPayment.value;
        upObj["factoring"] = {};
        upObj["factoring"]["name"] = "";
        upObj["factoring"]["address"] = "";
        upObj["factoring"]["agent_name"] = "";
        upObj["factoring"]["agent_email"] = "";
        upObj["factoring"]["phone_no"] = "";
      }
      await axios
        .put(`/updatecarrier/${params.mc}`, upObj)
        .then((response) => {
          toast.success(closeCheck ? "Carrier Registered" : "Carrier Saved");
          if (carrier.c_status !== response.data.c_status) {
            if (response.data.c_status === "registered") {
              socket.emit("carriers-updates", {
                _id: response.data._id,
                change: selectedCarrierStatus.value,
                createdAt: new Date(),
                saleperson: response.data.salesman.user_name,
                carrier: response.data.company_name,
              });
            }
          }
          setCarrier(response.data);
          setLoaderButton(false);
        })
        .catch((err) => {
          setLoaderButton(false);
        });
      if (closeCheck) {
        setTimeout(() => {
          setCloseCheck(false);
          history.push("/appointments");
        }, 2000);
      }
    } else {
      setValidated(true);
    }
  };

  const openModal = () => {
    setdModal(true);
  };

  const deactivateHandler = async (event) => {
    event.preventDefault();
    await axios.put(`/updatecarrier/${params.mc}`, {
      c_status: "deactivated",
      comment: event.target.deactivate.value,
    });
    socket.emit("deactivate-carrier", `${params.mc}`);
    setdModal(false);

    setTimeout(() => {
      history.push("/appointments");
    }, 2000);
  };

  if (isLoading && !error) {
    return (
      <div className="spreadsheet__loader">
        <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && error) {
    return (
      <div className="spreadsheet__loader">
        <h4 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h4>
      </div>
    );
  }
  const closeHandler = () => {
    setSelectedCarrierStatus({ label: "Registered ", value: "registered" });
    setCloseCheck(true);
  };
  const changestatusHandler = () => {
    setChangeStatus(true);
  };

  const cschandler = async () => {
    setStatusChanged(true);
    setChangeStatus(false);
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row style={{ marginTop: "23px" }}>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Row>
              <Col>
                {" "}
                <h4>MC:</h4>{" "}
              </Col>
              <Col md={9}>
                <Form.Control
                  type="text"
                  placeholder="Payment Method"
                  required
                  defaultValue={carrier ? carrier.mc_number : ""}
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
                <h4>Address:</h4>{" "}
              </Col>
              <Col md={9}>
                <Form.Control
                  type="text"
                  placeholder="Payment Method"
                  required
                  defaultValue={carrier ? carrier.address : ""}
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
                <h4>Phone #:</h4>{" "}
              </Col>
              <Col md={9}>
                <Form.Control
                  type="text"
                  placeholder="Phone #"
                  name="phone_number"
                  required
                  readOnly={
                    currUser.department === "sales" &&
                    !(carrier.c_status === "appointment")
                      ? true
                      : false
                  }
                  defaultValue={carrier ? carrier.phone_number : ""}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Phone Number.
                </Form.Control.Feedback>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Row>
              <Col>
                {" "}
                <h4>Email:</h4>{" "}
              </Col>
              <Col md={9}>
                <Form.Control
                  placeholder="Email"
                  type="text"
                  required
                  name="email"
                  defaultValue={carrier ? carrier.email : ""}
                  readOnly={
                    currUser.department === "sales" &&
                    !(carrier.c_status === "appointment")
                      ? true
                      : false
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Col>
            </Row>
          </Form.Group>
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
            <h4> Sales Comments:</h4>
          </Col>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
            as={Col}
            md="6"
          >
            <TextArea
              style={{ width: "500px" }}
              placeholder="Comment.."
              defaultValue={carrier ? carrier.comment : ""}
              name="Comment:"
              readOnly={
                currUser.department === "sales" &&
                !(carrier.c_status === "appointment")
                  ? true
                  : false
              }
            />
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom03">
            <Form.Label>Call back time:</Form.Label>
            <Form.Control
              type="datetime-local"
              defaultValue={
                carrier.appointment
                  ? moment(new Date(carrier.appointment)).format(
                      "YYYY-MM-DDTHH:mm"
                    )
                  : ""
              }
              name="appointment"
              disabled={
                currUser.department === "sales" &&
                !(carrier.c_status === "appointment")
                  ? true
                  : false
              }
            />
            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
          </Form.Group>
        </Row>
        {currUser.department === "admin" && (
          <>
            {" "}
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
                    defaultValue={carrier ? carrier.dispatcher_comment : ""}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
        <h4>Carrier Details :</h4>

        <Row className="m-3">
          <Row>
            <Form.Group as={Col} md="4" controlId="validationCustom03">
              <Form.Label>Owner Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Owner Name"
                name="owner_name"
                required
                defaultValue={carrier ? carrier.owner_name : ""}
                readOnly={
                  currUser.department === "sales" &&
                  !(carrier.c_status === "appointment")
                    ? true
                    : false
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Owner name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationCustom03">
              <Form.Label>*Dispatch Fee:</Form.Label>
              <Form.Control
                type="number"
                placeholder="*Dispatch Fee:"
                name="dispatch_fee"
                defaultValue={
                  carrier.dispatcher_fee ? carrier.dispatcher_fee : 0
                }
                readOnly={
                  currUser.department === "sales" &&
                  !(carrier.c_status === "appointment")
                    ? true
                    : false
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid entity.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationCustom03">
              <Form.Label>Tax Id:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Tax Id"
                defaultValue={carrier ? carrier.tax_id_number : ""}
                name="tax_id"
                required
                readOnly={
                  currUser.department === "sales" &&
                  !(carrier.c_status === "appointment")
                    ? true
                    : false
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Tax Id.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="my-3">
            <Col md={4}>
              <MySelect
                isDisabled={
                  currUser.department === "sales" &&
                  !(carrier.c_status === "appointment")
                    ? true
                    : false
                }
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
            </Col>
          </Row>

          {selectedPayment.value === "factoring" ? (
            <div>
              <h4>Factoring Details:</h4>
              <Row className="my-3">
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Company's Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Company's Name"
                    name="f_name"
                    defaultValue={
                      carrier && carrier.factoring ? carrier.factoring.name : ""
                    }
                    readOnly={
                      currUser.department === "sales" &&
                      !(carrier.c_status === "appointment")
                        ? true
                        : false
                    }
                    required={
                      selectedPayment.value === "factoring" ? true : false
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Company's Name.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Address:</Form.Label>
                  <Form.Control
                    type="text"
                    name="f_address"
                    defaultValue={
                      carrier && carrier.factoring
                        ? carrier.factoring.address
                        : ""
                    }
                    placeholder="Address"
                    required={
                      selectedPayment.value === "factoring" ? true : false
                    }
                    readOnly={
                      currUser.department === "sales" &&
                      !(carrier.c_status === "appointment")
                        ? true
                        : false
                    }
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
                    name="f_agent_name"
                    defaultValue={
                      carrier && carrier.factoring
                        ? carrier.factoring.agent_name
                        : ""
                    }
                    required={
                      selectedPayment.value === "factoring" ? true : false
                    }
                    readOnly={
                      currUser.department === "sales" &&
                      !(carrier.c_status === "appointment")
                        ? true
                        : false
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Agent's Name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Agent's Email:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Agent's Email"
                    name="f_agent_email"
                    defaultValue={
                      carrier && carrier.factoring
                        ? carrier.factoring.agent_email
                        : ""
                    }
                    required={
                      selectedPayment.value === "factoring" ? true : false
                    }
                    readOnly={
                      currUser.department === "sales" &&
                      !(carrier.c_status === "appointment")
                        ? true
                        : false
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Agent's Email.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Phone Number"
                    name="f_phone"
                    defaultValue={
                      carrier && carrier.factoring
                        ? carrier.factoring.phone_no
                        : ""
                    }
                    required={
                      selectedPayment.value === "factoring" ? true : false
                    }
                    readOnly={
                      currUser.department === "sales" &&
                      !(carrier.c_status === "appointment")
                        ? true
                        : false
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Phone Number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </div>
          ) : null}
        </Row>

        <h4>Insurance Details:</h4>
        <Row className="my-3 insurance-width">
          <Form.Group as={Col} md="4" controlId="validationCustom03">
            <Form.Label>Company's Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Company's Name"
              name="i_company_name"
              defaultValue={
                carrier && carrier.insurance ? carrier.insurance.name : ""
              }
              required
              readOnly={
                currUser.department === "sales" &&
                !(carrier.c_status === "appointment")
                  ? true
                  : false
              }
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Company's Name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom03">
            <Form.Label>Address:</Form.Label>
            <Form.Control
              type="text"
              name="i_address"
              defaultValue={
                carrier && carrier.insurance ? carrier.insurance.address : ""
              }
              placeholder="Address"
              required
              readOnly={
                currUser.department === "sales" &&
                !(carrier.c_status === "appointment")
                  ? true
                  : false
              }
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Address.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="my-3 insurance-width">
          <Form.Group as={Col} md="4" controlId="validationCustom03">
            <Form.Label>Agent's Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Agent's Name"
              name="i_agent_name"
              defaultValue={
                carrier && carrier.insurance ? carrier.insurance.agent_name : ""
              }
              required
              readOnly={
                currUser.department === "sales" &&
                !(carrier.c_status === "appointment")
                  ? true
                  : false
              }
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Agent's Name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustom03">
            <Form.Label>Agent's Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Agent's Email"
              name="i_agent_email"
              defaultValue={
                carrier && carrier.insurance
                  ? carrier.insurance.agent_email
                  : ""
              }
              required
              readOnly={
                currUser.department === "sales" &&
                !(carrier.c_status === "appointment")
                  ? true
                  : false
              }
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Agent's Email.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom03">
            <Form.Label>Phone Number:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Phone Number"
              name="i_phone_number"
              defaultValue={
                carrier && carrier.insurance ? carrier.insurance.phone_no : ""
              }
              required
              readOnly={
                currUser.department === "sales" &&
                !(carrier.c_status === "appointment")
                  ? true
                  : false
              }
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Phone Number.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        {currUser.department === "admin" && (
          <>
            <hr />
            <Row>
              <Form.Label>Salesman:</Form.Label>
              <Form.Group as={Col} md="4" controlId="validationCustom03">
                <MySelect
                  isMulti={false}
                  value={selectedSalesperson}
                  onChange={setSelectedSalesperson}
                  options={
                    salesperson &&
                    salesperson.map((item) => {
                      return {
                        label: item.user_name,
                        value: item._id,
                      };
                    })
                  }
                />
              </Form.Group>
            </Row>
          </>
        )}
        {!(
          currUser.department === "sales" &&
          !(carrier.c_status === "appointment")
        ) ? (
          <Row
            className="justify-content-between"
            style={{ marginTop: "10px" }}
          >
            <hr />
            <Col md={9}>
              <Button
                disabled={
                  currUser.department === "sales" &&
                  !(carrier.c_status === "appointment")
                    ? true
                    : !closeCheck
                    ? loaderButton
                    : false
                }
                onClick={
                  currUser.department === "sales"
                    ? () => {
                        setCloseCheck(false);
                      }
                    : ""
                }
                variant="success"
                size="lg"
                type="submit"
              >
                {!closeCheck
                  ? loaderButton && (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )
                  : null}
                {currUser.department === "sales" ? "Save" : "Update Carrier"}
              </Button>
            </Col>
            <Col md={3} className="d-flex justify-content-end">
              {currUser.department === "sales" && (
                <>
                  <Button
                    style={{ float: "right", marginRight: "5px" }}
                    size="lg"
                    variant="danger"
                    onClick={openModal}
                    disabled={
                      currUser.department === "sales" &&
                      !(carrier.c_status === "appointment")
                        ? true
                        : false
                    }
                  >
                    Reject
                  </Button>
                  <Button
                    variant="info"
                    style={{ float: "right", marginRight: "5px" }}
                    // onClick={handlePrint}
                    onClick={()=>{setPrintModal(true)}}
                  >
                    Print
                  </Button>
                  <Button
                    size="lg"
                    type="submit"
                    onClick={closeHandler}
                    disabled={
                      currUser.department === "sales" &&
                      !(carrier.c_status === "appointment")
                        ? true
                        : closeCheck
                        ? loaderButton
                        : false
                    }
                  >
                    {closeCheck
                      ? loaderButton && (
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        )
                      : null}
                    Close Sale
                  </Button>
                </>
              )}
              {currUser.department === "admin" && (
                <>
                  {" "}
                  <Button
                    style={{ float: "right" }}
                    size="lg"
                    onClick={changestatusHandler}
                  >
                    Change Status
                  </Button>
                </>
              )}
            </Col>
            <Col></Col>
          </Row>
        ) : null}
      </Form>
      <Modal
        show={changeStatus}
        heading="Change Carrier Status"
        onClose={() => {
          setChangeStatus(false);
        }}
        onConfirm={cschandler}
        btnText="Update"
      >
        <Form>
          <MySelect
            isMulti={false}
            value={selectedCarrierStatus}
            onChange={setSelectedCarrierStatus}
            options={[
              { label: "Registered ", value: "registered" },
              { label: "Appointment ", value: "appointment" },
              { label: "Deactivated ", value: "deactivated" },
              { label: "Unassigned ", value: "unassigned" },
              { label: "Didnotpick ", value: "didnotpick" },
              { label: "Rejected ", value: "rejected" },
            ]}
          />
        </Form>
        <div className="status_wrapper_c_d">
          <p>
            <span className="status_labal">Appointment:</span>
            <span className="status_text">
              {" "}
              Contract in progress by salesperson
            </span>
          </p>
          <p>
            <span className="status_labal">Registered:</span>
            <span className="status_text">
              {" "}
              Active carriers who are in contract with us
            </span>
          </p>
          <p>
            <span className="status_labal">Rejected:</span>
            <span className="status_text">
              {" "}
              Reached by the salesperson but were not interested.
            </span>
          </p>
          <p>
            <span className="status_labal">Didnotpick:</span>
            <span className="status_text">
              {" "}
              Reached by salesperson but didn't pick the call.
            </span>
          </p>
          <p>
            <span className="status_labal">Unassigned:</span>{" "}
            <span className="status_text">No salesperson assigned yet</span>
          </p>
          <p>
            <span className="status_labal">Deactivate:</span>{" "}
            <span className="status_text">
              Were working with us but have left us now.
            </span>
          </p>
        </div>
      </Modal>

      <Modal
        show={dModal}
        heading="Deactivate Carrier"
        onClose={() => {
          setdModal(false);
        }}
      >
        <Form onSubmit={deactivateHandler}>
          <Form.Group className="mb-3" controlId="deactivate_carrier">
            <Form.Control
              placeholder="Comment here"
              as="textarea"
              name="deactivate"
              rows={5}
              style={{
                borderRadius: "15px",
                height: "99px",
                padding: "10px",
              }}
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal>
      <Modal
        size="xl"
        show={printModal}
        heading="Print"
        fullscreen={true}
        onClose={() => {
          setPrintModal(false);
        }}
      >
        <NewSalePDF carrier={carrier} />
      </Modal>
      <hr />
      <TruckTable
        mc={carrier.mc_number}
        trucks={trucks}
        setTrucks={setTrucks}
        disabled={
          currUser.department === "sales" &&
          !(carrier.c_status === "appointment")
            ? true
            : false
        }
      />
      {/* <div ref={ref} style={{display: printModal?"block":"none"}} >
        <NewSalePDF carrier={carrier} />
      </div> */}
    </>
  );
};

export default CarrierDetails;

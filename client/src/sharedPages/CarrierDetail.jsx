import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import TruckTable from "../components/table/TruckTable";
import FileHandleTable from "../components/table/FileHandleTable";
import TooltipCustom from "../components/tooltip/TooltipCustom";
import TextArea from "../components/UI/TextArea";
import Loader from "react-loader-spinner";
import BackButton from "../components/UI/BackButton";
import Modal from "../components/modals/MyModal";
import axios from "axios";
import { Form, Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import MySelect from "../components/UI/MySelect";
import Input from "../components/UI/MyInput";
// import { socket } from "../../index";
import { socket } from "../index";
import { useSelector } from "react-redux";
import useHttp from "../hooks/use-https";
import useInput from "../hooks/use-input";
import "../assets/css/sharedpages/carrierdetail.css"

const CarrierDetail = () => {
  const currUser = useSelector((state) => state.user.user);
  const [trucks, setTrucks] = useState([]);
  const history = useHistory();
  const params = useParams();
  const [carrier, setCarrier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dModal, setdModal] = useState();
  const [error, setError] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loaderButton, setloaderButton] = useState(false);
  const [rmodal, setrModal] = useState();
  const { sendRequest: updateCarrier } = useHttp();

  const factAddressRef = useRef();//
  const factPhoneRef = useRef();//
  const factAgentNameRef = useRef();//
  const factAgentEmailRef = useRef();//
  const carrierEmailRef = useRef();//

  const commentRef = useRef();//
  const ownerNameRef = useRef();//
  const factCompNameRef = useRef();//

  const insAgentNameRef = useRef();//
  const isNotEmpty = (value) => value.trim() !== "";
  const {
    value: fee,
    isValid: feeIsValid,
    hasError: feeHasError,
    valueChangeHandler: feeChangeHandler,
    inputBlurHandler: feeBlurHandler,
  } = useInput(isNotEmpty);

  const [onSelectedMcFile, setonSelectedMcFile] = useState()
  const [onSelectedInsuranceFile, setonSelectedInsuranceFile] = useState()
  const [onSelectedNoaFile, setonSelectedNoaFile] = useState()
  const [onSelectedW9File, setonSelectedW9File] = useState()

  const [viewfile, setviewfile] = useState(false)


  useEffect(() => {
    setIsLoading(true);
    setError(false);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getcarrier`, {
        mc_number: params.mc,
      })
      .then(({ data }) => {
        if (data) {
          setCarrier(data);
          setTrucks(data.trucks);
          setTrucks(data.trucks);
        } else {
          setError(true);
        }
        setonSelectedMcFile(undefined);
        setonSelectedInsuranceFile(undefined);
        setonSelectedNoaFile(undefined);
        setonSelectedW9File(undefined);
        setIsLoading(false);
      });
  }, [params.mc, viewfile]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const appointmentRef = useRef();
  // const selectedPayment = useRef();
  const taxId = useRef();
  const insCompName = useRef();
  const insAddress = useRef();
  const insPhone = useRef();
  const insAgentName = useRef();
  const insAgentEmail = useRef();
  // const fee = useRef();

  const saveCarrier = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    // let owner = event.target.owner_name.value 
    // console.log(owner)
    setValidated(true);
    if (form.checkValidity() === true) {
      setloaderButton(true);
      const upObj = {
        owner_name: event.target.owner_name.value,
        phone_number: event.target.phone_number.value,
        email: event.target.email.value,
        tax_id_number: event.target.tax_id.value,
        insurance: {
          name: event.target.i_company_name.value,
          address: event.target.i_address.value,
          phone_no: event.target.i_phone_number.value,
          agent_name: event.target.i_agent_name.value,
          agent_email: event.target.i_agent_email.value,
        },
      };
      if (carrier.payment_method === "factoring") {
        upObj["factoring"] = {};
        upObj["factoring"]["name"] = event.target.f_name.value;
        upObj["factoring"]["address"] = event.target.f_address.value;
        upObj["factoring"]["agent_name"] = event.target.f_agent_name.value;
        upObj["factoring"]["agent_email"] = event.target.f_agent_email.value;
        upObj["factoring"]["phone_no"] = event.target.f_phone.value;
      }
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${params.mc}`,
          upObj
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Carrier Saved");
          setCarrier(response.data);
          setloaderButton(false);
        })
        .catch((err) => {
          console.log(err);
          setloaderButton(false);
        });
    }
  };


  console.log(carrier, " Carrier Data")

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      setloaderButton(true);
      const upObj = {
        owner_name: event.target.owner_name.value,
        phone_number: event.target.phone_number.value,
        email: event.target.email.value,
        tax_id_number: event.target.tax_id.value,
        insurance: {
          name: event.target.i_company_name.value,
          address: event.target.i_address.value,
          phone_no: event.target.i_phone_number.value,
          agent_name: event.target.i_agent_name.value,
          agent_email: event.target.i_agent_email.value,
        },
      };
      if (carrier.payment_method === "factoring") {
        upObj["factoring"] = {};
        upObj["factoring"]["name"] = event.target.f_name.value;
        upObj["factoring"]["address"] = event.target.f_address.value;
        upObj["factoring"]["agent_name"] = event.target.f_agent_name.value;
        upObj["factoring"]["agent_email"] = event.target.f_agent_email.value;
        upObj["factoring"]["phone_no"] = event.target.f_phone.value;
      }
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${params.mc}`,
          upObj
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Carrier Saved");
          setCarrier(response.data);
          setloaderButton(false);
        })
        .catch((err) => {
          console.log(err);
          setloaderButton(false);
        });
    }
  };

  const openModal = () => {
    setdModal(true);
  };

  const deactivateHandler = async () => {
    setloaderButton(true);
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${params.mc}`,
      {
        c_status: "deactivated",
      }
    );
    socket.emit("deactivate-carrier", `${params.mc}`);
    setTimeout(() => {
      setdModal(false);
    }, 3000);
    // history.push("/mytrucks");
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
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  }

  const onrConfirm = () => {
    setrModal(true);
  };

  const rejectHandler = async () => {
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        c_status: "rejected",
        comment: commentRef.current.value,
      }
    );
    setrModal(false);
    history.push("/appointments");
  };
  const onrClose = () => {
    setrModal(false);
  };


  // const addMcFile=()=>{
  //   mcFileRef.current.click();
  // }
  const onSelectMcFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setonSelectedMcFile(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setonSelectedMcFile(e.target.files[0]);
  };
  const handleUploadMcFile = async (e) => {
    if (carrier.mc_file) {
      const del = await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${carrier.mc_file?.substring(
          carrier.mc_file?.lastIndexOf("/") + 1
        )}`
      );
      console.log(del, " del file")
    }
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${onSelectedMcFile.type.split("/")[1]}`
    );
    axios.put(url, onSelectedMcFile);
    console.log(url)

    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        mc_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setviewfile(!viewfile)
    toast.success(carrier.mc_file ? "File Updated" : "File Uploaded");

  }
  const onSelectInsuranceFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setonSelectedInsuranceFile(undefined);
      return;
    }
    setonSelectedInsuranceFile(e.target.files[0]);
  };
  const handleUploadInsuranceFile = async (e) => {
    
    if (carrier.insurance_file) {
      const del = await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${carrier.insurance_file?.substring(
          carrier.insurance_file?.lastIndexOf("/") + 1
        )}`
      );
      console.log(del, " del file")
    }
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${onSelectedInsuranceFile.type.split("/")[1]}`
    );
    axios.put(url, onSelectedInsuranceFile);
    console.log(url)

    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        insurance_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setviewfile(!viewfile)
    toast.success(carrier.insurance_file ? "File Updated" : "File Uploaded");

  }
  const onSelectNoaFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setonSelectedNoaFile(undefined);
      return;
    }
    setonSelectedNoaFile(e.target.files[0]);
  };
  const handleUploadNoaFile = async (e) => {
    
    if (carrier.noa_file) {
      const del = await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${carrier.noa_file?.substring(
          carrier.noa_file?.lastIndexOf("/") + 1
        )}`
      );
      console.log(del, " del file")
    }
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${onSelectedNoaFile.type.split("/")[1]}`
    );
    axios.put(url, onSelectedNoaFile);
    console.log(url)

    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        noa_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setviewfile(!viewfile)
    toast.success(carrier.noa_file ? "File Updated" : "File Uploaded");

  }
  const onSelectW9File = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setonSelectedW9File(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setonSelectedW9File(e.target.files[0]);
  };
  const handleUploadW9File = async (e) => {
    if (carrier.w9_file) {
      const del = await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${carrier.w9_file?.substring(
          carrier.w9_file?.lastIndexOf("/") + 1
        )}`
      );
      console.log(del, " del file")
    }
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${onSelectedW9File.type.split("/")[1]}`
    );
    axios.put(url, onSelectedW9File);
    console.log(url)

    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        w9_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setviewfile(!viewfile)
    toast.success(carrier.w9_file ? "File Updated" : "File Uploaded");

  }

  return (
    <div className="row">
      <div className="col">
        <BackButton onClick={() => history.push("/searchcarrier")} />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Card
            className="truck-detail-card"
            style={{
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
                      <h3>Address:</h3>{" "}
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
                      <h3>Phone #:</h3>{" "}
                    </Col>
                    <Col md={9}>
                      <Form.Control

                        type="text"
                        placeholder="Payment Method"
                        name="phone_number"
                        required
                        defaultValue={carrier ? carrier.phone_number : ""}
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
                        ref={carrierEmailRef}
                        type="text"
                        required
                        name="email"
                        defaultValue={carrier ? carrier.email : ""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid entity.
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </Form.Group>
              </Row>
              <Row
                style={{
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
                      defaultValue={carrier ? carrier.comment : ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              {currUser.department === "admin" && (<>   <Row
                style={{
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
                      defaultValue={carrier ? carrier.dispatcher_comment : ""}
                    />
                  </Form.Group>
                </Col>
              </Row>
              </>)}
              <h2>Carrier Details :</h2>

              <Row className="m-3">
                <Row>
                  <Form.Group as={Col} md="4" controlId="validationCustom03">
                    <Form.Label>Owner Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Owner Name"
                      name="owner_name"
                      defaultValue={carrier ? carrier.owner_name : ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid entity.
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* <Col></Col> */}
                  {currUser.department === "sales" && (
                    <>

                      <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Label>*Dispatch Fee:</Form.Label>
                        <Form.Control
                          type="Number"
                          placeholder="*Dispatch Fee:"
                          name="owner_name"
                          defaultValue={carrier.dispatcher_fee ? carrier.dispatcher_fee : 0}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid entity.
                        </Form.Control.Feedback>
                      </Form.Group>





                      <Col>
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
                      </Col>
                    </>)}

                  {currUser.department === "admin" && (
                    <>
                      <Form.Group as={Col} md="3" controlId="validationCustom05">
                        <Form.Label>Payment Method:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Payment Method"
                          required
                          defaultValue={carrier ? carrier.payment_method : ""}
                          disabled
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid entity.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>)}
                </Row>
                <Row className="my-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom03">
                    <Form.Label>Tax Id:</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Tax Id"
                      defaultValue={carrier ? carrier.tax_id_number : ""}
                      name="tax_id"
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
                      ref={insAgentNameRef}
                      type="text"
                      placeholder="Company's Name"
                      name="i_company_name"
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.name
                          : ""
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
                      ref={insAddress}
                      type="text"
                      name="i_address"
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.address
                          : ""
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
                      ref={factAgentNameRef}
                      type="text"
                      placeholder="Agent's Name"
                      name="i_agent_name"
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.agent_name
                          : ""
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
                      ref={factAgentEmailRef}
                      placeholder="Agent's Email"
                      name="i_agent_email"
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.agent_email
                          : ""
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
                      ref={factPhoneRef}
                      type="text"
                      placeholder="Phone Number"
                      name="i_phone_number"
                      defaultValue={
                        carrier && carrier.insurance
                          ? carrier.insurance.phone_no
                          : ""
                      }
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
                          ref={factCompNameRef}
                          type="text"
                          placeholder="Company's Name"
                          name="f_name"
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.name
                              : ""
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
                          name="f_address"
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.address
                              : ""
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
                          name="f_agent_name"
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.agent_name
                              : ""
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
                          name="f_agent_email"
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.agent_email
                              : ""
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
                          name="f_phone"
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.phone_no
                              : ""
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
              {currUser.department === "admin" && (
                <>
                  <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                      <Form.Label>Salesman:</Form.Label>
                      <Form.Control
                        type="text"
                        readOnly
                        defaultValue={
                          carrier &&
                          carrier.salesman &&
                          carrier.salesman.user_name
                        }
                        required
                      />
                    </Form.Group>
                  </Row>
                  <hr />
                </>
              )}
              <h3>Carrier Documents:</h3>
{/* MC FILE START */}
              <Row className="justify-content-start">
                {/* <Col md={1}></Col> */}
                <Col md={2} className="fileHeading">
                  <h3 className=""> MC </h3>
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{carrier.mc_file ? "file uploaded" : "No file uploaded"}</Form.Label>
                  <Form.Control className="file__input" type="file"required name="file" onChange={onSelectMcFile}/>
                  <Form.Control.Feedback type="invalid" tooltip></Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedMcFile && carrier.mc_file ? "update file" : carrier.mc_file ? "select file to update" : onSelectedMcFile ? "upload file" : "select file to upload"} id='mcfile' ></TooltipCustom>
                  <TooltipCustom text='view file' id='mcfileview' ></TooltipCustom>
                  <div className="actions_button_wrapper">
                    <div data-tip data-for="mcfile">
                      <Button disabled={!onSelectedMcFile} className="action_button">
                        <i className={`bx ${carrier.mc_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadMcFile}></i>
                      </Button>
                    </div>
                    {carrier.mc_file ?
                      <div data-tip data-for="mcfileview">
                        <a href={carrier.mc_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                      </div> : null}
                  </div>
                </Col>
              </Row>
{/* MC FILE END */}
{/* noa FILE START */}
<Row className="justify-content-start">
                {/* <Col md={1}></Col> */}
                <Col md={2} className="fileHeading">
                  <h3> Noa </h3>
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{carrier.noa_file? "file uploaded" : "No file uploaded"}</Form.Label>
                  <Form.Control className="file__input" type="file"required name="file" onChange={onSelectNoaFile}/>
                  <Form.Control.Feedback type="invalid" tooltip></Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedNoaFile && carrier.noa_file? "update file" : carrier.noa_file? "select file to update" : onSelectedNoaFile ? "upload file" : "select file to upload"} id='noafile' ></TooltipCustom>
                  <TooltipCustom text='view file' id='noafileview' ></TooltipCustom>
                  <div className="actions_button_wrapper">
                    <div data-tip data-for="noafile">
                      <Button disabled={!onSelectedNoaFile} className="action_button">
                        <i className={`bx ${carrier.noa_file? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadNoaFile}></i>
                      </Button>
                    </div>
                    {carrier.noa_file?
                      <div data-tip data-for="noafileview">
                        <a href={carrier.noa_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                      </div> : null}
                  </div>
                </Col>
              </Row>
{/* noa FILE END */}
{/* w9 FILE START */}
<Row className="justify-content-start">
                {/* <Col md={1}></Col> */}
                <Col md={2} className="fileHeading">
                  <h3> W9 </h3>
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{carrier.w9_file ? "file uploaded" : "No file uploaded"}</Form.Label>
                  <Form.Control className="file__input" type="file"required name="file" onChange={onSelectW9File}/>
                  <Form.Control.Feedback type="invalid" tooltip></Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedW9File && carrier.w9_file ? "update file" : carrier.w9_file ? "select file to update" : onSelectedW9File ? "upload file" : "select file to upload"} id='w9file' ></TooltipCustom>
                  <TooltipCustom text='view file' id='w9fileview' ></TooltipCustom>
                  <div className="actions_button_wrapper">
                    <div data-tip data-for="w9file">
                      <Button disabled={!onSelectedW9File} className="action_button">
                        <i className={`bx ${carrier.w9_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadW9File}></i>
                      </Button>
                    </div>
                    {carrier.w9_file ?
                      <div data-tip data-for="w9fileview">
                        <a href={carrier.w9_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                      </div> : null}
                  </div>
                </Col>
              </Row>
{/* w9 FILE END */}
{/* insurance_file FILE START */}
<Row className="justify-content-start">
                {/* <Col md={1}></Col> */}
                <Col md={2} className="fileHeading">
                  <h3> Insurance </h3>
                </Col>
                
                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{carrier.insurance_file ? "file uploaded" : "No file uploaded"}</Form.Label>
                  <Form.Control className="file__input" type="file"required name="file" onChange={onSelectInsuranceFile} />
                  <Form.Control.Feedback type="invalid" tooltip></Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedInsuranceFile && carrier.insurance_file ? "update file" : carrier.insurance_file ? "select file to update" : onSelectedInsuranceFile ? "upload file" : "select file to upload"} id='insurancefile' ></TooltipCustom>
                  <TooltipCustom text='view file' id='insurancefileview' ></TooltipCustom>
                  <div className="actions_button_wrapper">
                    <div data-tip data-for="insurancefile">
                      <Button disabled={!onSelectedInsuranceFile} className="action_button">
                        <i className={`bx ${carrier.insurance_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadInsuranceFile}></i>
                        
                      </Button>
                    </div>
                    {carrier.insurance_file ?
                      <div data-tip data-for="insurancefileview">
                        <a href={carrier.insurance_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                      </div> : null}
                  </div>
                </Col>
              </Row>
{/* insurance_file FILE END */}

              {/* Misc Files */}




              {/* Mise Files */}


              {/* <FileHandleTable carrier={carrier}/> */}


              {/* <Row xs="auto" className="m-3">
                <Col>
                  {carrier &&
                    carrier.insurance_file &&
                    carrier.insurance_file !== "" && (
                      <Button
                        onClick={() => {
                          const pdfWindow = window.open();
                          pdfWindow.location.href = `${carrier.insurance_file}`;
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
                        pdfWindow.location.href = `${carrier.noa_file}`;
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
                        pdfWindow.location.href = `${carrier.mc_file}`;
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
                        pdfWindow.location.href = `${carrier.w9_file}`;
                      }}
                    >
                      W9
                    </Button>
                  )}
                </Col>
              </Row> */}
              <Row
                className="justify-content-between"
                style={{ marginTop: "10px" }}
              >
                <hr />
                <Col md={4}>
                  <Button
                    disabled={loaderButton}
                    // onClick={handleSubmit}
                    variant="success"
                    size="lg"
                    type="submit"
                  >
                    {loaderButton && (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    {currUser.department === "sales" ? "Save" : "Update Carrier"}
                  </Button>
                </Col>
                <Col md={4} className="d-flex justify-content-center"><Button size="lg"
                // onClick={saveCarrier}
                >Close Sale</Button></Col>
                <Col md={4}>
                  {currUser.department === "admin" && (<> <Button
                    style={{ float: "right" }}
                    size="lg"
                    variant="danger"
                    onClick={openModal}
                    disabled={carrier.c_status !== "registered"}
                  >
                    Deactivate Carrier
                  </Button>
                  </>
                  )}
                  {currUser.department === "sales" && (<><Button
                    style={{ float: "right" }}
                    size="lg"
                    variant="danger"
                    onClick={openModal}
                  // disabled={carrier.c_status !== "registered"}
                  >
                    Reject
                  </Button>
                  </>
                  )}
                </Col>
                <Col>

                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>

        <Modal
          show={rmodal}
          heading="Reject Carrier"
          onConfirm={rejectHandler}
          onClose={onrClose}
        >
          <form>
            <TextArea
              name="Comment:"
              placeholder="Comment here..."
              // value={commentRef.current.value}
              defaultValue={commentRef.current && commentRef.current.value}
              // onChange={(e) => setComment(e.target.value)}
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
        <Modal
          show={dModal}
          heading="Deactivate Carrier"
          onConfirm={!loaderButton && deactivateHandler}
          onClose={() => {
            setdModal(false);
          }}
        >
          <p>Are You Sure you want to deactivate?</p>
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

export default CarrierDetail;

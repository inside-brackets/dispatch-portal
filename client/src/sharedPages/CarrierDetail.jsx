import React, { useState, useEffect} from "react";
import { useParams, useHistory } from "react-router-dom";
import TruckTable from "../components/table/TruckTable";
import TooltipCustom from "../components/tooltip/TooltipCustom";
import TextArea from "../components/UI/TextArea";
import Loader from "react-loader-spinner";
import BackButton from "../components/UI/BackButton";
import DeleteConfirmation from "../components/modals/DeleteConfirmation"
import Modal from "../components/modals/MyModal";
import MyModal from "../components/modals/MyModal";
import axios from "axios";
import { Form, Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import MySelect from "../components/UI/MySelect";
import Badge from "../components/badge/Badge";
import { socket } from "../index";
import { useSelector } from "react-redux";
import CStatus from "../assets/JsonData/status_map.json"
import "../assets/css/sharedpages/carrierdetail.css"

const CarrierDetail = () => {
  const currUser = useSelector((state) => state.user.user)
  const [trucks, setTrucks] = useState([]);
  const history = useHistory();
  const params = useParams();
  const [carrier, setCarrier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dModal, setdModal] = useState();
  const [error, setError] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loaderButton, setLoaderButton] = useState(false);
  const [onSelectedMcFile, setOnSelectedMcFile] = useState()
  const [onSelectedInsuranceFile, setOnSelectedInsuranceFile] = useState()
  const [onSelectedNoaFile, setOnSelectedNoaFile] = useState()
  const [onSelectedW9File, setOnSelectedW9File] = useState()
  const [selectedMiscFile, setSelectedMiscFile] = useState(null);
  const [nameMisc, setNameMisc] = useState(null);
  const [showMicsModal, setShowMicsModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [closeCheck, setCloseCheck] = useState(false)
  const [changeStatus, setChangeStatus] = useState(false)
  const [statusChanged, setStatusChanged] = useState()
  const [salePerson, setSalePerson] = useState("")
  const [selectedCarrierStatus, setSelectedCarrierStatus] = useState("")
  const [miscLoader, setMiscLoader] = useState(false)
  
  const [mcLoader, setMcLoader] = useState(false)
  const [w9Loader, setW9Loader] = useState(false)
  const [noaLoader, setNoaLoader] = useState(false)
  const [insuranceLoader, setInsuranceLoader] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/getcarrier`, {
      mc_number: params.mc,
    })
      .then(({ data }) => {
        setIsLoading(false);
        if (data) {
          setCarrier(data);
          setTrucks(data.trucks);
          setSalePerson(data.salesman.user_name)
          setSelectedPayment({ label: data.payment_method.charAt(0).toUpperCase() + data.payment_method.slice(1), value: data.payment_method });
          setSelectedCarrierStatus({ label: data.c_status.charAt(0).toUpperCase() + data.c_status.slice(1), value: data.c_status })
          
        } else {
          setError(true);
        }
        
      });
  }, [params.mc]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(currUser.department === "admin")) {
      if (closeCheck && form.checkValidity()) {
        setSelectedCarrierStatus({ label: "Registered", value: "registered" })
      } else {
        setSelectedCarrierStatus({ label: carrier.c_status.charAt(0).toUpperCase() + carrier.c_status.slice(1), value: carrier.c_status })
      }
    }
    const bypass = selectedCarrierStatus.value !== "registered"
    if (bypass || form.checkValidity() === true) {
      setLoaderButton(true)
      const upObj = {
        owner_name: event.target.owner_name.value,
        phone_number: event.target.phone_number.value,
        email: event.target.email.value,
        tax_id_number: event.target.tax_id.value,
        dispatcher_fee: event.target.dispatch_fee.value,
        insurance: {
          name: event.target.i_company_name.value,
          address: event.target.i_address.value,
          phone_no: event.target.i_phone_number.value,
          agent_name: event.target.i_agent_name.value,
          agent_email: event.target.i_agent_email.value,
        },
      };
      if (selectedCarrierStatus.value === "registered") {
        if (!carrier.mc_file || !carrier.noa_file || !carrier.w9_file || !carrier.insurance_file) {
          toast.warn("Upload Files");
          setLoaderButton(false);
          setCloseCheck(false)
          return
        }
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/getcarrier`, {
            mc_number: params.mc,
          })
          .then(({ data }) => {
            if (data) {
              setTrucks(data.trucks)
            }
          })
        if (!(trucks.length >= 1)) {
          toast.warn("Add Truck");
          setLoaderButton(false);
          return
        }
      }
      if (closeCheck) {
        upObj["c_status"] = "registered"
      }
      if (statusChanged) {
        upObj["c_status"] = selectedCarrierStatus.value
      }

      if (selectedPayment.value === "factoring") {
        upObj["payment_method"] = selectedPayment.value
        upObj["factoring"] = {};
        upObj["factoring"]["name"] = event.target.f_name.value;
        upObj["factoring"]["address"] = event.target.f_address.value;
        upObj["factoring"]["agent_name"] = event.target.f_agent_name.value;
        upObj["factoring"]["agent_email"] = event.target.f_agent_email.value;
        upObj["factoring"]["phone_no"] = event.target.f_phone.value;
      } else {
        upObj["payment_method"] = selectedPayment.value
        upObj["factoring"] = {};
        upObj["factoring"]["name"] = "";
        upObj["factoring"]["address"] = "";
        upObj["factoring"]["agent_name"] = "";
        upObj["factoring"]["agent_email"] = "";
        upObj["factoring"]["phone_no"] = "";
      }
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${params.mc}`,
          upObj
        )
        .then((response) => {
          toast.success(closeCheck ? "Carrier Registered" : "Carrier Saved");
          setCarrier(response.data);
          setLoaderButton(false);
        })
        .catch((err) => {
          setLoaderButton(false);
        });
      if (closeCheck) {
        setTimeout(() => {
          setCloseCheck(false)
          history.push("/appointments");
        }, 2000);
      }
    } else {
      setValidated(true)
    }
  };


  const openModal = () => {
    setdModal(true);
  };

  const deactivateHandler = async (event) => {
    event.preventDefault()
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${params.mc}`,
      {
        c_status: "deactivated",
        comment: event.target.deactivate.value
      }
    );
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

  const onSelectMcFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setOnSelectedMcFile(undefined);
      return;
    }
    setOnSelectedMcFile(e.target.files[0]);
  };
  const handleUploadMcFile = async (e) => {
    setMcLoader(true)
    if (carrier.mc_file) {
          await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${carrier.mc_file?.substring(
          carrier.mc_file?.lastIndexOf("/") + 1
        )}`
      );
    }
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${onSelectedMcFile.type.split("/")[1]}`
    );
    axios.put(url, onSelectedMcFile).then(()=>{setMcLoader(false)});
    
    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        mc_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setCarrier(updatedCarrier.data)
    toast.success(carrier.mc_file ? "File Updated" : "File Uploaded");

  }
  const onSelectInsuranceFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setOnSelectedInsuranceFile(undefined);
      return;
    }
    setOnSelectedInsuranceFile(e.target.files[0]);
  };
  const handleUploadInsuranceFile = async (e) => {

    if (carrier.insurance_file) {
      await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${carrier.insurance_file?.substring(
          carrier.insurance_file?.lastIndexOf("/") + 1
        )}`
      );
    }
    setInsuranceLoader(true)
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${onSelectedInsuranceFile.type.split("/")[1]}`
    );
    axios.put(url, onSelectedInsuranceFile).then(() =>{
      setInsuranceLoader(false)
    });
    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        insurance_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setCarrier(updatedCarrier.data)
    toast.success(carrier.insurance_file ? "File Updated" : "File Uploaded");

  }
  const onSelectNoaFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setOnSelectedNoaFile(undefined);
      return;
    }
    setOnSelectedNoaFile(e.target.files[0]);
  };
  const handleUploadNoaFile = async (e) => {

    if (carrier.noa_file) {
      await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${carrier.noa_file?.substring(
          carrier.noa_file?.lastIndexOf("/") + 1
        )}`
      );
    }
    setNoaLoader(true)
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${onSelectedNoaFile.type.split("/")[1]}`
    );
    axios.put(url, onSelectedNoaFile).then(() =>{
      setNoaLoader(false)
    });

    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        noa_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setCarrier(updatedCarrier.data)
    toast.success(carrier.noa_file ? "File Updated" : "File Uploaded");

  }
  const onSelectW9File = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setOnSelectedW9File(undefined);
      return;
    }
    setOnSelectedW9File(e.target.files[0]);
  };
  const handleUploadW9File = async (e) => {
    if (carrier.w9_file) {
      await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${carrier.w9_file?.substring(
          carrier.w9_file?.lastIndexOf("/") + 1
        )}`
      );
    }
    setW9Loader(true)
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${onSelectedW9File.type.split("/")[1]}`
    );
    axios.put(url, onSelectedW9File).then(()=>{
      setW9Loader(false)
    });

    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        w9_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setCarrier(updatedCarrier.data)
    
    toast.success(carrier.w9_file ? "File Updated" : "File Uploaded");
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedMiscFile(undefined);
      return;
    }
    setSelectedMiscFile(e.target.files[0]);
  };

  const handleSubmitMisc = async (e) => {
    setMiscLoader(true)
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}.${selectedMiscFile.type.split("/")[1]}`
    );
    await axios.put(url, selectedMiscFile);
    const updatedCarrier = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarriermisc/${carrier.mc_number}`,
      {
        files: {
          name: nameMisc,
          file: url.split("?")[0],
        },
        updateFiles: true,
      }
    );
    setCarrier(updatedCarrier.data)
    setMiscLoader(false)
    setShowMicsModal(false)
    setNameMisc("")

    toast.success("File Uploaded");
  };
  const submitDeleteMisc = async () => {
    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
      {
        files: carrier.files.filter((item) => item._id !== deleteModal._id),
      }
    );
    await axios(
    setCarrier(updatedCarrier.data)
      `${process.env.REACT_APP_BACKEND_URL
      }/s3url-delete/carrier_documents/${deleteModal.file?.substring(
        deleteModal.file?.lastIndexOf("/") + 1
      )}`
    );
    setDeleteModal(false);
    toast.success("File Deleted");
  };

  const closeHandler = () => {
    setSelectedCarrierStatus({ label: "Registered ", value: "registered" })
    setCloseCheck(true)
  }
  const changestatusHandler = () => {
    setChangeStatus(true)
  }

  const cschandler = async () => {
    setStatusChanged(true)
    setChangeStatus(false)

  }

  return (
    <div className="row">
      <div className="col">
        <BackButton onClick={() => history.push("/searchcarrier")} />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Card
            className="truck-detail-card"
            style={{
              marginLeft: "30px",
              marginRight: "30px",
            }}
          >
            <Card.Body>
              <div className="carrier_badge_status"><Badge
                type={CStatus[carrier.c_status]}
                content={carrier.c_status}
              /></div>
              <h1 className="text-center">{carrier.company_name}  </h1>
              <hr />
              <Row>
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
                      defaultValue={carrier.dispatcher_fee ? carrier.dispatcher_fee : 0}
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
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid Tax Id.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="my-3">

                  <Col md={4}>
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
                  </Col>
                </Row>

                {selectedPayment.value === "factoring" ? (
                  <div>
                    <h4>Factoring Details:</h4>
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
                          name="f_name"
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.name
                              : ""
                          }
                          required={selectedPayment.value === "factoring" ? true : false}
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
                          required={selectedPayment.value === "factoring" ? true : false}
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
                          required={selectedPayment.value === "factoring" ? true : false}
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
                          type="email"
                          placeholder="Agent's Email"
                          name="f_agent_email"
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.agent_email
                              : ""
                          }
                          required={selectedPayment.value === "factoring" ? true : false}
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
                          type="number"
                          placeholder="Phone Number"
                          name="f_phone"
                          defaultValue={
                            carrier && carrier.factoring
                              ? carrier.factoring.phone_no
                              : ""
                          }
                          required={selectedPayment.value === "factoring" ? true : false}
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
              <Row className="my-3 insurance-width">
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Agent's Name:</Form.Label>
                  <Form.Control
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
                    type="email"
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
                    type="number"
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
                          salePerson ? salePerson : ""
                        }
                        required
                      />
                    </Form.Group>
                  </Row>
                  <hr />
                </>
              )}
              <h4>Carrier Documents:</h4>
              {/* MC FILE START */}
              <Row className="justify-content-start">
                {/* <Col md={1}></Col> */}
                <Col md={2} >
                  <h4 className="fileHeading"> MC </h4>
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{carrier.mc_file ? <Badge
                    type="success"
                    content="Uploaded"
                  /> : <Badge
                    type="warning"
                    content="Not uploaded"
                  />}</Form.Label>
                  <Form.Control className="file__input" type="file" name="file" defaultValue={carrier.w9_file ? carrier.w9_file : ""} onChange={onSelectMcFile} />
                  <Form.Control.Feedback type="invalid">{!carrier.mc_file ? "Please Upload MC File." : null}</Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedMcFile && carrier.mc_file ? "update file" : carrier.mc_file ? "select file to update" : onSelectedMcFile ? "upload file" : "select file to upload"} id='mcfile' ></TooltipCustom>

                  <div className="actions_button_wrapper">
                    <div data-tip data-for="mcfile">
                      <Button disabled={!onSelectedMcFile|| mcLoader} className="action_button">
                        <i className={`bx ${carrier.mc_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadMcFile}></i>
                      </Button>
                    </div>
                    {carrier.mc_file ?
                    <>
                    <TooltipCustom text='view file' id='mcfileview' ></TooltipCustom>
                      <div data-tip data-for="mcfileview">
                      <Button disabled={mcLoader} className="action_button">
                        <a href={carrier.mc_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                        </Button>
                      </div></> : null}
                  </div>
                </Col>
                <hr className="basic_file_hr" />
              </Row>
              {/* MC FILE END */}
              {/* noa FILE START */}
              <Row className="justify-content-start">
                {/* <Col md={1}></Col> */}
                <Col md={2} >
                  <h4 className="fileHeading"> Noa </h4>
                  {/* <hr/> */}
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier" >
                  <Form.Label className="file_input_label">{carrier.noa_file ? <Badge type="success" content="Uploaded" /> : <Badge type="warning" content="Not uploaded" />}</Form.Label>
                  <Form.Control className="file__input" type="file" name="file" defaultValue={carrier.w9_file ? carrier.w9_file : ""} onChange={onSelectNoaFile} />
                  <Form.Control.Feedback type="invalid">{!carrier.noa_file ? "Please Upload Noa File." : null}</Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedNoaFile && carrier.noa_file ? "update file" : carrier.noa_file ? "select file to update" : onSelectedNoaFile ? "upload file" : "select file to upload"} id='noafile' ></TooltipCustom>
                  
                  <div className="actions_button_wrapper">
                    <div data-tip data-for="noafile">
                      <Button disabled={!onSelectedNoaFile || noaLoader} className="action_button">
                        <i className={`bx ${carrier.noa_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadNoaFile}></i>
                      </Button>
                    </div>
                    {carrier.noa_file ?
                    <>
                    <TooltipCustom text='view file' id='noafileview' ></TooltipCustom>
                    <Button disabled={noaLoader} className="action_button">
                      <div data-tip data-for="noafileview">
                        <a href={carrier.noa_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                      </div></Button> </>: null}
                  </div>
                </Col>

                <hr className="basic_file_hr" />

              </Row>

              {/* noa FILE END */}
              {/* w9 FILE START */}
              <Row className="justify-content-start">
                {/* <Col md={1}></Col> */}
                <Col md={2} >
                  <h4 className="fileHeading"> W9 </h4>
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{carrier.w9_file ? <Badge
                    type="success"
                    content="Uploaded"
                  /> : <Badge
                    type="warning"
                    content="Not uploaded"
                  />}</Form.Label>
                  <Form.Control className="file__input" type="file" name="file" defaultValue={carrier.w9_file ? carrier.w9_file : ""} onChange={onSelectW9File} />
                  <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedW9File && carrier.w9_file ? "update file" : carrier.w9_file ? "select file to update" : onSelectedW9File ? "upload file" : "select file to upload"} id='w9file' ></TooltipCustom>

                  <div className="actions_button_wrapper">
                    <div data-tip data-for="w9file">
                      <Button disabled={!onSelectedW9File || w9Loader} className="action_button">
                        <i className={`bx ${carrier.w9_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadW9File}></i>
                      </Button>
                    </div>
                    {carrier.w9_file ?
                    <>
                    <TooltipCustom text='view file' id='w9fileview' ></TooltipCustom>
                    <Button disabled={w9Loader} className="action_button">
                      <div data-tip data-for="w9fileview">
                        <a href={carrier.w9_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                      </div></Button> </>: null}
                  </div>
                </Col>
                <hr className="basic_file_hr" />
              </Row>
              {/* w9 FILE END */}
              {/* insurance_file FILE START */}
              <Row className="justify-content-start">
                {/* <Col md={1}></Col> */}
                <Col md={2} >
                  <h4 className="fileHeading"> Insurance </h4>
                </Col>

                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{carrier.insurance_file ? <Badge
                    type="success"
                    content="Uploaded"
                  /> : <Badge
                    type="warning"
                    content="Not uploaded"
                  />}</Form.Label>
                  <Form.Control className="file__input" type="file" name="file" defaultValue={carrier.w9_file ? carrier.w9_file : ""} onChange={onSelectInsuranceFile} />
                  <Form.Control.Feedback type="invalid" >{!carrier.insurance_file ? "Please Upload Insurance File." : null}</Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedInsuranceFile && carrier.insurance_file ? "update file" : carrier.insurance_file ? "select file to update" : onSelectedInsuranceFile ? "upload file" : "select file to upload"} id='insurancefile' ></TooltipCustom>
                  
                  <div className="actions_button_wrapper">
                    <div data-tip data-for="insurancefile">
                      <Button disabled={!onSelectedInsuranceFile || insuranceLoader} className="action_button">
                        <i className={`bx ${carrier.insurance_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadInsuranceFile}></i>

                      </Button>
                    </div>
                    {carrier.insurance_file ?
                    <>
                    <TooltipCustom text='view file' id='insurancefileview' ></TooltipCustom>
                    <Button disabled={insuranceLoader} className="action_button">
                      <div data-tip data-for="insurancefileview">
                        <a href={carrier.insurance_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                      </div>
                      </Button></> : null}
                  </div>
                </Col>
              </Row>
              {/* insurance_file FILE END */}

              {/* Misc Files */}
              <h4>Miscellaneous Documents:</h4>
              <Row>
                {carrier.files?.map((file) => {
                  return (
                    <div key={file.file} className="miscWrapper">
                      <Row className="justify-content-start" >
                        <Col md={6}>
                          <h5 className="misc_file_name"> {file.name.length > 10 ? file.name.substring(0, 11) + "..." : file.name} </h5>
                        </Col>
                        <Col md={1}>
                          <TooltipCustom text='view file' id={file.name} ></TooltipCustom>
                          <TooltipCustom text='delete file' id={file.file} ></TooltipCustom>
                          <div className="actions_button_misc_wrapper">
                            <div data-tip data-for={file.file}>
                              <span onClick={() => setDeleteModal(file)}>
                                <i className="bx bx-trash-alt action-button"></i>
                              </span>
                            </div>
                            <div data-tip data-for={file.name}>
                              <a href={file.file}>
                                <i className="bx bx-show-alt action-button"></i>
                              </a>
                            </div>
                          </div>
                        </Col>
                        <hr className="basic_file_hr" />
                      </Row>
                    </div>
                  );
                })}
              </Row>

              <DeleteConfirmation
                showModal={deleteModal}
                confirmModal={submitDeleteMisc}
                hideModal={() => setDeleteModal(false)}
                message={"Are you Sure to want to delete File?"}
                title="Delete Confirmation"
              />
              <Row className="add-misc-btn">
                <Col md={2}><Button onClick={() => { setShowMicsModal(true) }}>Add Misc</Button></Col>
              </Row>
              <Row>
                <MyModal
                  size="lg"
                  show={showMicsModal}
                  heading="Add Document"
                  onClose={() => setShowMicsModal(false)}
                  style={{ width: "auto" }}
                >

                  <Row className="justify-content-center">
                    <Form.Group as={Col} md={10} controlId="validationCustom01">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        onChange={(e) => setNameMisc(e.target.value)}
                        placeholder="First name"
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="justify-content-center">
                    <Form.Group as={Col} md={10} className="position-relative my-5">
                      <Form.Label>Attachments</Form.Label>
                      <Form.Control
                        type="file"
                        required
                        name="file"
                        onChange={onSelectFile}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        tooltip
                      ></Form.Control.Feedback>
                    </Form.Group>
                  </Row>{" "}
                  <Button
                    style={{
                      float: "right",
                    }}
                    disabled={miscLoader}
                    onClick={handleSubmitMisc}
                    type="submit"
                  >
                    {miscLoader && (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    Add
                  </Button>
                </MyModal>

              </Row>


              {/* Mise Files END*/}

              <Row
                className="justify-content-between"
                style={{ marginTop: "10px" }}
              >
                <hr />
                <Col md={9}>
                  <Button
                    disabled={!closeCheck ? loaderButton : false}
                    onClick={currUser.department === "sales" ? () => { setCloseCheck(false) } : ""}
                    variant="success"
                    size="lg"
                    type="submit"
                  >
                    {!closeCheck ? loaderButton && (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : null}
                    {currUser.department === "sales" ? "Save" : "Update Carrier"}
                  </Button>
                </Col>
                <Col md={3} className="d-flex justify-content-end">

                  {currUser.department === "sales" && (<><Button
                    style={{ float: "right", marginRight: '5px' }}
                    size="lg"
                    variant="danger"
                    onClick={openModal}
                  >
                    Reject
                  </Button>
                    <Button size="lg" type="submit"
                      onClick={closeHandler}
                      disabled={closeCheck ? loaderButton : false}
                    >
                      {closeCheck ? loaderButton && (
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : null}
                      Close Sale
                    </Button>
                  </>
                  )}
                  {currUser.department === "admin" && (<> <Button
                    style={{ float: "right" }}
                    size="lg"
                    onClick={changestatusHandler}
                  >
                    Change Status
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
          show={changeStatus}
          heading="Change Carrier Status"
          onClose={() => { setChangeStatus(false) }}
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
                { label: "Rejected ", value: "rejected" }
              ]}
            />

          </Form>
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
              <Form.Control placeholder="Comment here" as="textarea" name="deactivate" rows={5} style={{ borderRadius: "15px", height: "99px", padding: "10px" }} />
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
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
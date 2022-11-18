import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Form, Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import LoadTable from "../../components/table/LoadTable";
import TextArea from "../../components/UI/TextArea";
import Modal from "../../components/modals/MyModal";
import { useHistory } from "react-router-dom";
import MySelect from "../../components/UI/MySelect";
import BackButton from "../../components/UI/BackButton";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import TooltipCustom from "../../components/tooltip/TooltipCustom";
import Badge from "../../components/badge/Badge";
import DeleteConfirmation from "../../components/modals/DeleteConfirmation"
import "../../assets/css/dispatch/truckDetail.css"
import MyModal from "../../components/modals/MyModal";

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
  const [confirmModal, setconfirmModal] = useState({value:false,index:0})
  const [drivers, setDrivers] = useState([
    {
      name: "",
      email_address: "",
      phone_number: "",
    },
  ]);

  const [miscLoader, setMiscLoader] = useState(false)
  
  const [mcLoader, setMcLoader] = useState(false)
  const [w9Loader, setW9Loader] = useState(false)
  const [noaLoader, setNoaLoader] = useState(false)
  const [insuranceLoader, setInsuranceLoader] = useState(false)
  const [onSelectedMcFile, setOnSelectedMcFile] = useState()
  const [onSelectedInsuranceFile, setOnSelectedInsuranceFile] = useState()
  const [onSelectedNoaFile, setOnSelectedNoaFile] = useState()
  const [onSelectedW9File, setOnSelectedW9File] = useState()
  const [selectedMiscFile, setSelectedMiscFile] = useState(null);
  const [nameMisc, setNameMisc] = useState(null);
  
  const [showMicsModal, setShowMicsModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/getcarrier`,
        {
          "trucks.dispatcher": currUserId,
          mc_number: match.params.mc,
        }
      );
      console.log(response.data,"respons data===========")
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
        return item.truck_number.toString() === match.params.truck.toString();
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
  }, [currUserId, match]);

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
          setButtonLoader(false);
        })
        .catch((err) => {
          console.log(err);
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
        `${process.env.REACT_APP_BACKEND_URL}/updatetruck/${data.mc_number}/${match.params.truck}`,
        truckObj
      );
      console.log("truck aupdated", res);
      setButtonLoader(false);
    }
  };

  console.log("trucks", truck);

  const rejectHandler = async () => {
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${data.mc_number}`,
      {
        c_status: "deactivated",
        comment: commentRef.current.value,
        dispatcher_comment: dispatcherCommentRef.current.value,
      }
    );
    setrModal(false);
    console.log(commentRef.current.value);
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
    setconfirmModal(confirmModal.value)
    if(confirmModal.value){
    let newFormValues = [...drivers];
    newFormValues.splice(confirmModal.index, 1);
    setDrivers(newFormValues);
      setconfirmModal(false)
  }
    
  };

  const onmClose=()=>{
    setconfirmModal({value:false})
  }

  // FIle start
  const onSelectMcFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setOnSelectedMcFile(undefined);
      return;
    }
    setOnSelectedMcFile(e.target.files[0]);
  };
  const handleUploadMcFile = async (e) => {
    setMcLoader(true)
    if (data.mc_file) {
          await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${data.mc_file?.substring(
          data.mc_file?.lastIndexOf("/") + 1
        )}`
      );
    }
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${data.mc_number}.${onSelectedMcFile.type.split("/")[1]}`
    );
    console.log(url,"url==========>")
    axios.put(url, onSelectedMcFile).then(()=>{setMcLoader(false)});
    
    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${data.mc_number}`,
      {
        mc_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setData(updatedCarrier.data)
    toast.success(data.mc_file ? "File Updated" : "File Uploaded");

  }
  const onSelectInsuranceFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setOnSelectedInsuranceFile(undefined);
      return;
    }
    setOnSelectedInsuranceFile(e.target.files[0]);
  };
  const handleUploadInsuranceFile = async (e) => {

    if (data.insurance_file) {
      await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${data.insurance_file?.substring(
          data.insurance_file?.lastIndexOf("/") + 1
        )}`
      );
    }
    setInsuranceLoader(true)
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${data.mc_number}.${onSelectedInsuranceFile.type.split("/")[1]}`
    );
    axios.put(url, onSelectedInsuranceFile).then(() =>{
      setInsuranceLoader(false)
    });
    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${data.mc_number}`,
      {
        insurance_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setData(updatedCarrier.data)
    toast.success(data.insurance_file ? "File Updated" : "File Uploaded");

  }
  const onSelectNoaFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setOnSelectedNoaFile(undefined);
      return;
    }
    setOnSelectedNoaFile(e.target.files[0]);
  };
  const handleUploadNoaFile = async (e) => {

    if (data.noa_file) {
      await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${data.noa_file?.substring(
          data.noa_file?.lastIndexOf("/") + 1
        )}`
      );
    }
    setNoaLoader(true)
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${data.mc_number}.${onSelectedNoaFile.type.split("/")[1]}`
    );
    axios.put(url, onSelectedNoaFile).then(() =>{
      setNoaLoader(false)
    });

    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${data.mc_number}`,
      {
        noa_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setData(updatedCarrier.data)
    toast.success(data.noa_file ? "File Updated" : "File Uploaded");

  }
  const onSelectW9File = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setOnSelectedW9File(undefined);
      return;
    }
    setOnSelectedW9File(e.target.files[0]);
  };
  const handleUploadW9File = async (e) => {
    if (data.w9_file) {
      await axios(
        `${process.env.REACT_APP_BACKEND_URL
        }/s3url-delete/carrier_documents/${data.w9_file?.substring(
          data.w9_file?.lastIndexOf("/") + 1
        )}`
      );
    }
    setW9Loader(true)
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${data.mc_number}.${onSelectedW9File.type.split("/")[1]}`
    );
    axios.put(url, onSelectedW9File).then(()=>{
      setW9Loader(false)
    });

    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${data.mc_number}`,
      {
        w9_file: url.split("?")[0],
        updateFiles: true,
      },
    );
    setData(updatedCarrier.data)
    
    toast.success(data.w9_file ? "File Updated" : "File Uploaded");
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
      `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${data.mc_number}.${selectedMiscFile.type.split("/")[1]}`
    );
    await axios.put(url, selectedMiscFile);
    const updatedCarrier = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarriermisc/${data.mc_number}`,
      {
        files: {
          name: nameMisc,
          file: url.split("?")[0],
        },
        updateFiles: true,
      }
    );
    setData(updatedCarrier.data)
    setMiscLoader(false)
    setShowMicsModal(false)
    setNameMisc("")

    toast.success("File Uploaded");
  };
  const submitDeleteMisc = async () => {
    const updatedCarrier = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${data.mc_number}`,
      {
        files: data.files.filter((item) => item._id !== deleteModal._id),
      }
    );
    await axios(
    setData(updatedCarrier.data)
      `${process.env.REACT_APP_BACKEND_URL
      }/s3url-delete/carrier_documents/${deleteModal.file?.substring(
        deleteModal.file?.lastIndexOf("/") + 1
      )}`
    );
    setDeleteModal(false);
    toast.success("File Deleted");
  };
  //file end

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
          <BackButton onClick={() => history.push("/mytrucks")} />

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card
              className="truck-detail-card"
              style={{
                width: "auto",
                height: "auto",
                // marginLeft: "60px",
                // marginRight: "30px",
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
                        defaultValue={data.comment}
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
                        padding:'0px'
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
                      style={{
                        // marginLeft: "-300px",
                      }}
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
                        
                      <Col md={1} className='bx-trashh'>
                          {/* {drivers.length === 2 && ( */}
                            <i
                              className="bx bx-x"
                              onClick={() => setconfirmModal({value:true,index:index})}
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
            <div className="proceedText">If you proceed, You will lose all driver data. Are You sure do you want to delete your driver information?</div>
            <div className="buttonWrapper">
            <Button variant="secondary"  onClick={()=>setconfirmModal({value:false})}>Cancel</Button>
            <Button variant='danger' onClick={() => removeFormFields(confirmModal)} disabled={drivers.length === 2 ?false:true}>Confirm</Button>
            </div>
          </Modal>
                <hr />
                {/* <h3>Carrier Documents:</h3> */}
                {/* File Handling */}
                <h3>Carrier Documents:</h3>
              {/* MC FILE START */}
              <Row className="justify-content-start">
                <Col md={2} >
                  <h3 className="fileHeading"> MC </h3>
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{data.mc_file ? <Badge
                    type="success"
                    content="Uploaded"
                  /> : <Badge
                    type="warning"
                    content="Not uploaded"
                  />}</Form.Label>
                  <Form.Control className="file__input" type="file" name="file" onChange={onSelectMcFile} />
                  <Form.Control.Feedback type="invalid">{!data.mc_file ? "Please Upload MC File." : null}</Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedMcFile && data.mc_file ? "update file" : data.mc_file ? "select file to update" : onSelectedMcFile ? "upload file" : "select file to upload"} id='mcfile' ></TooltipCustom>

                  <div className="actions_button_wrapper">
                    <div data-tip data-for="mcfile">
                      <Button disabled={!onSelectedMcFile|| mcLoader} className="action_button">
                        <i className={`bx ${data.mc_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadMcFile}></i>
                      </Button>
                    </div>
                    {data.mc_file ?
                    <>
                    <TooltipCustom text='view file' id='mcfileview' ></TooltipCustom>
                      <div data-tip data-for="mcfileview">
                      <Button disabled={mcLoader} className="action_button">
                        <a href={data.mc_file}>
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
                <Col md={2} >
                  <h3 className="fileHeading"> Noa </h3>
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier" >
                  <Form.Label className="file_input_label">{data.noa_file ? <Badge type="success" content="Uploaded" /> : <Badge type="warning" content="Not uploaded" />}</Form.Label>
                  <Form.Control className="file__input" type="file" name="file" onChange={onSelectNoaFile} />
                  <Form.Control.Feedback type="invalid">{!data.noa_file ? "Please Upload Noa File." : null}</Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedNoaFile && data.noa_file ? "update file" : data.noa_file ? "select file to update" : onSelectedNoaFile ? "upload file" : "select file to upload"} id='noafile' ></TooltipCustom>
                  
                  <div className="actions_button_wrapper">
                    <div data-tip data-for="noafile">
                      <Button disabled={!onSelectedNoaFile || noaLoader} className="action_button">
                        <i className={`bx ${data.noa_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadNoaFile}></i>
                      </Button>
                    </div>
                    {data.noa_file ?
                    <>
                    <TooltipCustom text='view file' id='noafileview' ></TooltipCustom>
                    <Button disabled={noaLoader} className="action_button">
                      <div data-tip data-for="noafileview">
                        <a href={data.noa_file}>
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
                <Col md={2} >
                  <h3 className="fileHeading"> W9 </h3>
                </Col>
                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{data.w9_file ? <Badge
                    type="success"
                    content="Uploaded"
                  /> : <Badge
                    type="warning"
                    content="Not uploaded"
                  />}</Form.Label>
                  <Form.Control className="file__input" type="file" name="file"  onChange={onSelectW9File} />
                  <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedW9File && data.w9_file ? "update file" : data.w9_file ? "select file to update" : onSelectedW9File ? "upload file" : "select file to upload"} id='w9file' ></TooltipCustom>

                  <div className="actions_button_wrapper">
                    <div data-tip data-for="w9file">
                      <Button disabled={!onSelectedW9File || w9Loader} className="action_button">
                        <i className={`bx ${data.w9_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadW9File}></i>
                      </Button>
                    </div>
                    {data.w9_file ?
                    <>
                    <TooltipCustom text='view file' id='w9fileview' ></TooltipCustom>
                    <Button disabled={w9Loader} className="action_button">
                      <div data-tip data-for="w9fileview">
                        <a href={data.w9_file}>
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
                <Col md={2} >
                  <h3 className="fileHeading"> Insurance </h3>
                </Col>

                <Form.Group as={Col} md={4} className="file__input__contaier">
                  <Form.Label className="file_input_label">{data.insurance_file ? <Badge
                    type="success"
                    content="Uploaded"
                  /> : <Badge
                    type="warning"
                    content="Not uploaded"
                  />}</Form.Label>
                  <Form.Control className="file__input" type="file" name="file" onChange={onSelectInsuranceFile} />
                  <Form.Control.Feedback type="invalid" >{!data.insurance_file ? "Please Upload Insurance File." : null}</Form.Control.Feedback>
                </Form.Group>
                <Col md={1} className="actions_wrapper">
                  <TooltipCustom text={onSelectedInsuranceFile && data.insurance_file ? "update file" : data.insurance_file ? "select file to update" : onSelectedInsuranceFile ? "upload file" : "select file to upload"} id='insurancefile' ></TooltipCustom>
                  
                  <div className="actions_button_wrapper">
                    <div data-tip data-for="insurancefile">
                      <Button disabled={!onSelectedInsuranceFile || insuranceLoader} className="action_button">
                        <i className={`bx ${data.insurance_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadInsuranceFile}></i>

                      </Button>
                    </div>
                    {data.insurance_file ?
                    <>
                    <TooltipCustom text='view file' id='insurancefileview' ></TooltipCustom>
                    <Button disabled={insuranceLoader} className="action_button">
                      <div data-tip data-for="insurancefileview">
                        <a href={data.insurance_file}>
                          <i className="bx bx-show-alt action-button" ></i>
                        </a>
                      </div>
                      </Button></> : null}
                  </div>
                </Col>
              </Row>
              {/* insurance_file FILE END */}

              {/* Misc Files */}
              <h3>Miscellaneous Documents:</h3>
              <Row>
                {data.files?.map((file) => {
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
              <Row>
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
                {/* File Handling END*/}















                {/* <Row xs="auto" className="m-3">
                  <Col>
                    {data.insurance_file && data.insurance_file !== "" && (
                      <Button
                        onClick={() => {
                          const pdfWindow = window.open();
                          pdfWindow.location.href = `${data.insurance_file}`;
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
                          pdfWindow.location.href = `${data.noa_file}`;
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
                          pdfWindow.location.href = `${data.mc_file}`;
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
                          pdfWindow.location.href = `${data.w9_file}`;
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

          // style={{width: "98.5%",marginLeft:'11px'}}
            setModal={setrModal}
            truck_number={match.params.truck}
            carrier={data}
            truck={truck}
          />
        </div>
      )}
    </>
  );
};

export default TruckDetail;

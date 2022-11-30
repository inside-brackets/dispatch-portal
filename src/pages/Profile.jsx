import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import MyModal from "../components/modals/MyModal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import moment from "moment";
import bcrypt from "bcryptjs";

import { toast } from "react-toastify";
import Documents from "./Documents";
import UploadProfilePicture from "../components/modals/profilePageModals/UploadProfilePicture";
import user_image from "../assets/images/taut.png";
import Badge from "../components/badge/Badge";
import status_map from "../assets/JsonData/status_map.json";

const BasicInformation = ({ user }) => {
  const [dbUser, setDbUser] = useState();
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`/getuser/${user._id}`).then(({ data }) => {
      setDbUser(data);
    });
  }, [user._id]);

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    setError("loading...");
    const passwordCheck = await bcrypt.compare(oldPassword, user.password);

    if (!oldPassword && !newPassword && !confirmPassword) {
      setError("Please fill all fields");
    } else if (!passwordCheck) {
      setError("Old password is not Correct");
    } else if (newPassword !== confirmPassword) {
      setError("Confirm password is not same");
    } else {
      setShowModal(false);
      const pass = await bcrypt.hash(newPassword, 8);
      setError("");
      await axios.post(`/updateuser/${user._id}`, {
        id: user._id,
        password: pass,
      });
      toast.success("Password Updated Successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      if (user) {
        const formData = new FormData(event.currentTarget);
        const userInfo = Object.fromEntries(formData.entries());
        await axios.post(`/updateuser/${user._id}`, userInfo);
        toast.success("Profile Updated Successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const closeCloseModel = () => {
    setShowModal(false);
  };
  return (
    <Card style={{ border: "none", minHeight: "100vh", marginBottom: 0 }}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="m-3">
          <h4 className="mb-5">Personal Info</h4>
          <Form.Group as={Col} md="6">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              aria-describedby="inputGroupPrepend"
              name="first_name"
              defaultValue={dbUser?.first_name}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              name="last_name"
              defaultValue={dbUser?.last_name}
              required
            />
          </Form.Group>
        </Row>
        <Row className="m-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="date_of_birth"
              Value={
                dbUser ? moment(dbUser.date_of_birth).format("YYYY-MM-DD") : ""
              }
            />
          </Form.Group>
        </Row>
        <hr />

        <Row className="m-3">
          <h4 className="my-3">Contact Info</h4>
          <Form.Group as={Col} md="6">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              name="email_address"
              defaultValue={dbUser?.email_address}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Phone #</Form.Label>
            <Form.Control
              type="text"
              placeholder="Phone"
              name="phone_number"
              defaultValue={dbUser?.phone_number}
            />
          </Form.Group>

          <Form.Group as={Col} md="6">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              name="address"
              defaultValue={dbUser?.address}
            />
          </Form.Group>
          <Row className="justify-content-center mt-5">
            <Col md={3}>
              <p
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(true)}
              >
                Change Password
              </p>
            </Col>
            <MyModal
              size="md"
              show={showModal}
              heading="Change Password"
              onClose={closeCloseModel}
              style={{ width: "auto" }}
            >
              <Row className="justify-content-center">
                <Row className="mt-3">
                  {error && <Message>{error}</Message>}
                  <Form.Group as={Col}>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid Email.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mt-3">
                  <Form.Group as={Col}>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid Email.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mt-3">
                  <Form.Group as={Col}>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid Email.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Row>
              <Row className="mx-5 mt-3">
                <Button onClick={passwordChangeHandler}>Change Password</Button>
              </Row>
            </MyModal>
          </Row>
        </Row>
        <hr />
        <Button type="submit" variant="warning">
          Update Form
        </Button>
      </Form>
    </Card>
  );
};

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const { user } = useSelector((state) => state.user);
  return (
    <Row>
      <Col md={3} className="profile-image-panel">
        <Row>
          <Col md={2}>
            <Badge
              className="rounded-0 mt-4"
              type={status_map[user.u_status]}
              content={user.u_status}
            />
          </Col>
        </Row>
        <Row className="justify-content-center align-items-center">
          <Col md={10}>
            <div className="container">
              <span
                className="upload-img-icon"
                onClick={() => setShowModal(true)}
              >
                <i className="bx bx-pencil"></i>
              </span>
              <div className="circle">
                <img
                  src={
                    preview
                      ? preview
                      : user.profile_image
                      ? user.profile_image
                      : user_image
                  }
                  alt="profile"
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row className="my-5 justify-content-center text-capitalize">
          <Col className="text-center">
            <h3>{user.user_name}</h3>
          </Col>
        </Row>
        <hr />
        <Row className="my-5">
          <Col>
            <b>Designation</b>
          </Col>
          <Col className="text-end">{user.designation}</Col>
        </Row>
        <Row>
          <Col>
            <b>Joining Date</b>
          </Col>
          <Col className="text-end">
            {moment(user.joining_date).format("DD MMM YYYY")}
          </Col>
        </Row>
      </Col>
      <Col
        style={{
          padding: "0px",
        }}
        md={9}
      >
        <Tabs defaultActiveKey="home" id="justify-tab-example" justify>
          <Tab eventKey="home" title="Basic Information">
            <BasicInformation user={user} />
          </Tab>
          <Tab eventKey="profile" title="Documents">
            <Documents profile user={user} />
          </Tab>
        </Tabs>
      </Col>
      <MyModal
        size="lg"
        show={showModal}
        heading="Upload Picture"
        onClose={() => setShowModal(false)}
        style={{ width: "auto" }}
      >
        <UploadProfilePicture
          user={user}
          setModal={(data) => {
            setPreview(data);
            setShowModal(false);
          }}
        />
      </MyModal>
    </Row>
  );
}

export default Profile;

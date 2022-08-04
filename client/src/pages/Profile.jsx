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

const BasicInformation = ({user}) => {

  const [dbUser, setDbUser] = useState();
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/getuser/${user._id}`)
      .then(({ data }) => {
        console.log(data);
        setDbUser(data);
      });
  }, [user._id]);

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    const passwordCheck = await bcrypt.compare(oldPassword, user.password);
    if (!oldPassword && !newPassword && !confirmPassword) {
      setError("Please fill all fields");
    } else if (!passwordCheck) {
      console.log("user.password", passwordCheck);
      setError("Old Password is Not Correct");
    } else if (newPassword !== confirmPassword) {
      setError("Confirm Password is not same");
    } else {
      setShowModal(false);
      const pass = await bcrypt.hash(newPassword, 8);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/updateuser/${user._id}`,
        {
          id: user._id,
          password: pass,
        }
      );
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
        console.log("hello", userInfo.date_of_birth);

        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/updateuser/${user._id}`,
          userInfo
        );
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
    <Card>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="m-3">
          <h3>Personal Info</h3>
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
          <h3>Contact Info</h3>
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
        <Button type="submit">Edit form</Button>
      </Form>
    </Card>
  );
};

function Profile() {
  const [showModal, setShowModal] = useState(
    false
  )
  const { user } = useSelector((state) => state.user);
  return (
    <Row>
      <Col md={3} className="profile-image-panel">
        <Row>
          <div class="social" id="social1" onClick={()=> setShowModal(true)}>
            <img
              src={user.profile_image}
              alt="facebood"
              title="facebook"
            />
          </div>
        </Row>
      </Col>
      <Col md={9}>
        <Tabs
          defaultActiveKey="profile"
          id="justify-tab-example"
          // className="mb-3"
          justify
        >
          <Tab eventKey="home" title="Basic Information">
            <BasicInformation user={user} />
          </Tab>
          <Tab eventKey="profile" title="Documents">
            <Documents />
          </Tab>
        </Tabs>
      </Col>
      <MyModal
          size="lg"
          show={showModal}
          heading="Upload Picture"
          onClose={()=> setShowModal(false)}
          style={{ width: "auto" }}
        >
<UploadProfilePicture user={user} />
        </MyModal>
    </Row>
  );
}

export default Profile;

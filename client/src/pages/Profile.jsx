import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import MyModal from "../components/modals/MyModal";
import moment from "moment";
import bcrypt from "bcryptjs";

import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [dbUser, setDbUser] = useState();
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getuser`, {
        _id: user._id,
      })
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
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/updateuser`, {
          id: user._id,
          password: pass,
        })
        .then((response) => {
          let data = response.data;
          dispatch(
            userActions.login({
              user: data,
              company:
                data.company === "alpha"
                  ? {
                      label: "Alpha Dispatch Service",
                      value: "alpha",
                    }
                  : {
                      label: "Elite Dispatch Service",
                      value: "elite",
                    },
            })
          );
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
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/updateuser`,
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
    <Row>
      <h2>Edit Profile </h2>
      <Col>
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
                  defaultValue={
                    dbUser
                      ? moment(user.date_of_birth).format("YYYY-MM-DD")
                      : ""
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
                    <Button onClick={passwordChangeHandler}>
                      Change Password
                    </Button>
                  </Row>
                </MyModal>
              </Row>
            </Row>
            <hr />
            <Button type="submit">Edit form</Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;

import React, { useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user";
import { themeActions } from "../store/theme";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwtDecode from "jwt-decode";

import Message from "../components/Message";

const Login = () => {
  let history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [loginError, setLoginError] = useState({ status: false, msg: "" });
  const [unAuthorized, setUnAuthorized] = useState({ status: false, msg: "" });
  const [loading, setLoading] = useState(false);

  let { from } = location.state || { from: { pathname: "/" } };

  var loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    history.replace(from);
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError({ status: false, msg: "" });
    setUnAuthorized({ status: false, msg: "" });
    setLoading(true);

    try {
      const loginResponse = await axios({
        url: `/login`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          username: usernameRef.current.value,
        },
      });
      if (loginResponse.data.password) {
        const allowLogin = await bcrypt.compare(
          passwordRef.current.value,
          loginResponse.data.password
        );

        if (allowLogin) {
          const userToken = loginResponse.data.userToken;
          localStorage.setItem("user", userToken);
          const user = jwtDecode(userToken);
          if (user) {
            if (!(user.department === "admin") && !(user.department === "HR")) {
              await axios({
                url: `/logintime`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                data: {
                  employee: user._id,
                },
              });
            }
          }
          if (user) {
            dispatch(
              userActions.login({
                user: user,
                company:
                  user.company === "alpha"
                    ? {
                        label:
                          process.env.REACT_APP_FALCON === "true"
                            ? "Alpha Dispatch Service"
                            : "Company A",
                        value: "alpha",
                      }
                    : {
                        label:
                          process.env.REACT_APP_FALCON === "true"
                            ? "Elite Dispatch Service"
                            : "Company B",
                        value: "elite",
                      },
              })
            );
            if (user.company === "alpha") {
              dispatch(themeActions.setColor("theme-color-red"));
            } else {
              dispatch(themeActions.setColor("theme-color-blue"));
            }

            setLoginError(false);
            history.replace(from);
          } else {
            setLoginError({ status: true, msg: "No Such user in local" });
            setLoading(false);
          }
        } else {
          // passwrong
          setLoginError({ status: true, msg: "Incorrect Password" });
          setLoading(false);
        }
      } else {
        setLoginError({ status: true, msg: "User does not exists" });
        setLoading(false);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setUnAuthorized({
          status: true,
          msg: "Your computer is not authorized",
        });
        setLoading(false);
      } else {
        setUnAuthorized({
          status: true,
          msg: "Something wrong with the server",
        });
        setLoading(false);
      }
    }
  };
  return (
    <div
      style={{
        background: "url('/background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Row className="vh-100 vw-100">
        <Col md={6}>
          <FormContainer size="4" title="Login" addClass="noShadow">
            <Form>
              <Row style={{ margin: "16px" }}>
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Username"
                  ref={usernameRef}
                />
              </Row>

              <Row style={{ margin: "16px" }}>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Your Password"
                  ref={passwordRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin(e);
                    }
                  }}
                />
              </Row>
              {loginError.status && (
                <Form.Text style={{ color: "red", margin: "16px" }}>
                  {loginError.msg}
                </Form.Text>
              )}
              <Row style={{ margin: "16px" }} className="mt-4">
                <Button disabled={loading} onClick={handleLogin}>
                  {loading && (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  Login
                </Button>
              </Row>
            </Form>
          </FormContainer>
        </Col>
      </Row>
      {unAuthorized.status && (
        <div style={{ position: "absolute", top: "0px", width: "100%" }}>
          <Message>
            <center>{unAuthorized.msg}</center>
          </Message>
        </div>
      )}
    </div>
  );
};

export default Login;

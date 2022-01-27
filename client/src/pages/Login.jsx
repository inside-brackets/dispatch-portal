import React, { useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user";
import { Col, Row, Form, Image, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import logo from "../assets/images/logo_login.png";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwtDecode from "jwt-decode";

import Message from "../components/Message";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const Login = () => {
  let history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [loginError, setLoginError] = useState({ status: false, msg: "" });
  const [unAuthorized, setUnAuthorized] = useState({ status: false, msg: "" });

  let { from } = location.state || { from: { pathname: "/" } };

  var loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    history.replace(from);
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError({ status: false, msg: "" });
    setUnAuthorized({ status: false, msg: "" });

    try {
      const loginResponse = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/login`,
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

          cookies.set("user", userToken, { path: "/" });

          if (user) {
            console.log("login");
            dispatch(
              userActions.login({
                user: user,
                company:
                  user.company === "alpha"
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

            setLoginError(false);
            history.replace(from);
          } else {
            setLoginError({ status: true, msg: "No Such user in local" });
          }
        } else {
          // passwrong
          setLoginError({ status: true, msg: "Incorrect Password" });
        }
      } else {
        setLoginError({ status: true, msg: "User does not exists" });
      }
    } catch (err) {
      if (err.response.status === 501) {
        setUnAuthorized({
          status: true,
          msg: "Your computer is not authorized",
        });
      } else {
        setUnAuthorized({
          status: true,
          msg: "Something wrong with the server",
        });
      }
    }
  };
  return (
    <>
      <Row className="vh-100 vw-100" style={{ backgroundColor: "#ebf2fa" }}>
        <Col md={6}>
          <FormContainer size="4" title="Login">
            <Form>
              <Row style={{ margin: "10px" }}>
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="username..."
                  ref={usernameRef}
                />
              </Row>

              <Row style={{ margin: "10px" }}>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="password"
                  ref={passwordRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin(e);
                    }
                  }}
                />
              </Row>
              {loginError.status && (
                <Form.Text style={{ color: "red", margin: "10px" }}>
                  {loginError.msg}
                </Form.Text>
              )}
              <Row style={{ margin: "10px" }} className="mt-4">
                <Button onClick={handleLogin}>Login</Button>
              </Row>
            </Form>
          </FormContainer>
        </Col>
        <Col md={6}>
          <Image
            className="justify-content-start align-items-center vh-100 vw-100"
            src={logo}
            fluid
          />
        </Col>
      </Row>
      {unAuthorized.status && (
        <div style={{ position: "absolute", top: "0px", width: "100%" }}>
          <Message>
            <center>{unAuthorized.msg}</center>
          </Message>
        </div>
      )}
    </>
  );
};

export default Login;

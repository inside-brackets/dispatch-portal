import React, { useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user";
import { themeActions } from "../store/theme";
import Input from "../components/UI/MyInput";
import Button from "../components/UI/Button";
import { Col, Row, Form, Image } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import logo from "../assets/images/logo_login.png";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwtDecode from "jwt-decode";

const Login = () => {
  let history = useHistory();
  let location = useLocation();

  const dispatch = useDispatch();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [loginError, setLoginError] = useState(false);
  let { from } = location.state || { from: { pathname: "/" } };

  var user = localStorage.getItem("user");
  if (user) {
    history.replace(from);
  }
  const handleLogin = async (e) => {
    e.preventDefault();

    const pass = await axios({
      url: `${process.env.REACT_APP_BACKEND_URL}/login`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        username: usernameRef.current.value,
      },
    });
    if (pass.data.password) {
      const allowLogin = await bcrypt.compare(
        passwordRef.current.value,
        pass.data.password
      );

      if (allowLogin) {
        axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/getuser`,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: {
            user_name: usernameRef.current.value,
          },
        })
          .then(({ data }) => {
            console.log("test", data);
            localStorage.setItem("user", data);
            const jwt = localStorage.getItem("user");
            const user = jwtDecode(jwt);

            if (user) {
              if (user.company === "admin") {
                var selectedCompany = localStorage.getItem("selectedCompany");
                if (selectedCompany) {
                  dispatch(
                    userActions.login({
                      user: user,
                      company: JSON.parse(selectedCompany),
                    })
                  );
                  var color =
                    JSON.parse(selectedCompany).value === "elite"
                      ? "theme-color-blue"
                      : "theme-color-red";
                  dispatch(themeActions.setColor(color));
                } else {
                  dispatch(
                    userActions.login({
                      user: user,
                      company: {
                        label: "Elite Dispatch Service",
                        value: "elite",
                      },
                    })
                  );
                  dispatch(themeActions.setColor("theme-color-blue"));
                }
              } else {
                dispatch(
                  userActions.login({
                    user: user,
                    company: {
                      label: "Elite Dispatch Service",
                      value: "elite",
                    },
                  })
                );
                dispatch(themeActions.setColor("theme-color-blue"));
              }

              setLoginError(false);
              history.replace(from);
            } else {
              setLoginError(true);
            }
          })
          .catch((err) => {
            throw err;
          });
      } else {
        setLoginError(true);
      }
    } else {
      setLoginError(true);
    }
  };
  return (
    <Row className="vh-100 vw-100" style={{ backgroundColor: "#ebf2fa" }}>
      <Col md={6}>
        <FormContainer size="4" title="Login">
          <Row>
            <Col>
              <Form>
                <div className="d-flex  flex-column align-items-center">
                  <Form.Group className="justify-content-center">
                    <Input
                      type="text"
                      label="Username:"
                      ref={usernameRef}
                      placeholder="Enter username..."
                    />
                  </Form.Group>
                  <Form.Group>
                    <Input
                      type="password"
                      label="Password:"
                      ref={passwordRef}
                      placeholder="Enter password..."
                    />
                  </Form.Group>
                  {loginError && (
                    <p className="error-text">
                      Email or password is incorrect.
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleLogin}
                  className="float-right"
                  buttonText="Login"
                ></Button>
              </Form>
            </Col>
          </Row>
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
  );
};

export default Login;

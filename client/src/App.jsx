import React, { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "./store/user";
import { themeActions } from "./store/theme";
import { socket } from "./index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Howl, Howler } from "howler";
import notificationSound from "./assets/audio/notification.mp3";
import { useHistory } from "react-router-dom";
import Message from "./components/Message";
import axios from "axios";
import jwtDecode from "jwt-decode";

var sound = new Howl({
  src: notificationSound,
});

const App = () => {
  Howler.volume(1.0);
  let history = useHistory();
  const { isAuthorized } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const notify = (msg) =>
    toast.info(msg, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  useEffect(() => {
    socket.on("not-listed", (msg) => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/myip`).then((res) => {
        if (res.data === msg) {
          dispatch(userActions.unauthorize());
          dispatch(
            userActions.logout({
              cb: () => {
                localStorage.setItem("user", "");
              },
            })
          );
          history.replace("/login");
        }
      });
    });

    const jwt = localStorage.getItem("user");

    if (jwt) {
      const user = jwtDecode(jwt);
      // user = JSON.parse(user);
      socket.on("backend-notify", (msg) => {
        if (user.department === "admin") {
          notify(msg);
          sound.play();
          // fetch selectedCompany and set colors
        }
      });
      socket.on("sale-closed", (msg) => {
        if (user.department === "admin") {
          notify(msg);
          sound.play();
        }
      });
      if (user.department === "admin") {
        var selectedCompany = localStorage.getItem("selectedCompany");
        if (selectedCompany) {
          dispatch(
            userActions.login({ user, company: JSON.parse(selectedCompany) })
          );
          var color =
            JSON.parse(selectedCompany).value === "elite"
              ? "theme-color-blue"
              : "theme-color-red";
          dispatch(themeActions.setColor(color));
        } else {
          dispatch(
            userActions.login({
              user,
              company: {
                label: "Elite Dispatch Service",
                value: "elite",
              },
            })
          );
        }
      } else {
        dispatch(
          userActions.login({
            user,
            company: {
              label: "Elite Dispatch Service",
              value: "elite",
            },
          })
        );
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [dispatch, history]);
  return (
    <>
      <Switch>
        <Route path="/login" exact component={Login} />
        <PrivateRoute path="/">
          <Layout />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </PrivateRoute>
      </Switch>
      {!isAuthorized && (
        <div style={{ position: "absolute", top: "0px", width: "100%" }}>
          <Message>
            <center>Your computer is not authorized</center>
          </Message>
        </div>
      )}
    </>
  );
};
export default App;

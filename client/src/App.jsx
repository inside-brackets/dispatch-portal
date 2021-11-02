import React, { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "./store/user";
import { socket } from "./index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Howl, Howler } from "howler";
import notificationSound from "./assets/audio/notification.mp3";
import { useHistory } from "react-router-dom";
import Message from "./components/Message";

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
      dispatch(userActions.unauthorize());
      dispatch(
        userActions.logout({
          cb: () => {
            localStorage.setItem("user", "");
          },
        })
      );
      history.replace("/login");
    });

    var user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      socket.on("backend-notify", (msg) => {
        if (user.department === "admin") {
          notify(msg);
          sound.play();
        }
      });
      socket.on("sale-closed", (msg) => {
        if (user.department === "admin") {
          notify(msg);
          sound.play();
        }
      });
      dispatch(userActions.login(user));
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

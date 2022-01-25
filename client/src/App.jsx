import React, { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch } from "react-redux";
import { userActions } from "./store/user";
import { themeActions } from "./store/theme";
import { socket } from "./index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Howl, Howler } from "howler";
import notificationSound from "./assets/audio/notification.mp3";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import httpIntercept from "./interceptor/interceptor";

var sound = new Howl({
  src: notificationSound,
});

const App = () => {
  httpIntercept();
  Howler.volume(1.0);
  let history = useHistory();
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
    const jwt = localStorage.getItem("user");

    if (jwt) {
      try {
        var user = jwtDecode(jwt);
      } catch (error) {
        localStorage.removeItem("user");
        user = "";
      }

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
      socket.on("logout", (msg) => {
        if (msg.userId === user._id) {
          dispatch(
            userActions.logout({
              cb: () => {
                localStorage.removeItem("user");
                localStorage.removeItem("selectedCompany");
                // redirect
                history.replace("/login");
              },
            })
          );
        }
      });
      if (user.department === "admin") {
        var selectedCompany = localStorage.getItem("selectedCompany");
        if (selectedCompany) {
          console.log("login admin with local");

          dispatch(
            userActions.login({ user, company: JSON.parse(selectedCompany) })
          );
          var color =
            JSON.parse(selectedCompany).value === "elite"
              ? "theme-color-blue"
              : "theme-color-red";
          dispatch(themeActions.setColor(color));
        } else {
          console.log("login admin no local");
          dispatch(
            userActions.login({
              user,
              company: {
                label: "Elite Dispatch Service",
                value: "elite",
              },
            })
          );
          dispatch(themeActions.setColor("theme-color-blue"));
        }
      } else {
        console.log("login user");
        dispatch(
          userActions.login({
            user,
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
    </>
  );
};
export default App;

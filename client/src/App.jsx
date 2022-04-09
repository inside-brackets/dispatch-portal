import React, { useEffect, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
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

import Loader from "react-loader-spinner";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Layout = lazy(() => import("./components/layout/Layout"));
const Login = lazy(() => import("./pages/Login"));

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

  const currUser = useSelector((state) => state.user.user);

  useEffect(() => {
    socket.on("backend-notify", (msg) => {
      if (currUser?.department === "admin") {
        notify(msg);
        sound.play();
      }
    });

    socket.on("sale-closed", (msg) => {
      if (currUser?.department === "admin") {
        notify(msg);
        sound.play();
      }
    });

    socket.on("logout", (msg) => {
      if (msg.userId === currUser?._id) {
        dispatch(
          userActions.logout({
            cb: () => {
              localStorage.removeItem("user");
              cookies.remove("user");

              localStorage.removeItem("selectedCompany");
              history.replace("/login");
            },
          })
        );
      }
    });

    socket.on("backend-user-fired", (msg) => {
      if (msg === currUser?._id) {
        dispatch(
          userActions.logout({
            cb: () => {
              localStorage.removeItem("user");
              cookies.remove("user");

              localStorage.removeItem("selectedCompany");
              history.replace("/login");
            },
          })
        );
      }
    });
  }, [currUser, dispatch, history]);

  useEffect(() => {
    const jwt = localStorage.getItem("user");

    if (jwt) {
      try {
        var user = jwtDecode(jwt);
      } catch (error) {
        localStorage.removeItem("user");
        user = "";
      }

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
      cookies.remove("user");
    }
  }, [dispatch, history]);
  return (
    <Suspense
      fallback={
        <div className="spreadsheet__loader">
          <Loader
            type="MutatingDots"
            color="#349eff"
            height={100}
            width={100}
          />
        </div>
      }
    >
      <Switch>
        <Route path="/login" exact component={Login} />

        <PrivateRoute path="/">
          <Layout />
        </PrivateRoute>
      </Switch>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Suspense>
  );
};
export default App;

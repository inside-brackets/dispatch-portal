import React, { useEffect } from "react";
import "./layout.css";
import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Routes from "../Routes";
import { Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { themeActions } from "../../store/theme";

const Layout = () => {
  const themeReducer = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  useEffect(() => {
    const themeClass = localStorage.getItem("themeMode", "theme-mode-light");

    const colorClass = localStorage.getItem("colorMode", "theme-mode-light");

    dispatch(themeActions.setMode(themeClass));

    dispatch(themeActions.setColor(colorClass));
  }, [dispatch]);

  return (
    <Route
      render={(props) => (
        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
          <Sidebar {...props} />
          <div className="layout__content">
            <TopNav />
            <div className="layout__content-main">
              <Routes />
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default Layout;

import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/White-Christmas.png";
import sidebar_items from "../../assets/JsonData/sidebar_routes.json";
import { useSelector } from "react-redux";

const SidebarItem = (props) => {
  const active = props.active ? "active" : "";
  const { carriers } = useSelector((state) => state.sales);

  const count = carriers.length;
  return (
    <div className="sidebar__item">
      <div className={`sidebar__item-inner ${active}`}>
        <i className={props.icon}></i>
        <span>{props.title}</span>
        {props.title === "Assign Sales" && count !== 0 ? (
          <span className="dropdown__toggle-badge">{count}</span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const { department } = useSelector((state) => state.user.user);
  const sidebarHeading =
    department.toLowerCase() === "dispatch"
      ? "SERVICES "
      : department.toLowerCase() === "sales"
      ? "MARKETING"
      : department.toUpperCase();
  return (
    <div className="sidebar">
      <div className={process.env.REACT_APP_FALCON === "TRUE" ? `sidebar__logo_falcon`:"sidebar__logo"}>
        <img className="logo img-fluid" src={process.env.REACT_APP_FALCON === "TRUE" ? logo : logo2} alt="company logo" />
      </div>
      <center>
        <div className="sidebar__department">{`${sidebarHeading} PORTAL`}</div>
      </center>
      <div className="sidebar-items">
        {sidebar_items[department].map((item, index) => (
          <NavLink
            activeClassName="active__sidebar"
            to={item.route}
            key={index}
          >
            <SidebarItem title={item.display_name} icon={item.icon} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

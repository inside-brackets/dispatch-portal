import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import logo from "../../assets/images/logo.png";
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
  const { department, designation } = useSelector((state) => state.user.user);
  console.log(department, designation)
  const sidebarHeading =
    department.toLowerCase() === "dispatch"
      ? "SERVICES "
      : department.toLowerCase() === "sales"
      ? "MARKETING"
      : department.toUpperCase();

      console.log(sidebarHeading)
  const sidebarItems = 
    department === "sales" || department === "dispatch"
      ? sidebar_items[department][designation]
      : sidebar_items[department];

  return (
    <div className="sidebar">
      {/* <div className="sidebar__logo">
        <img className="logo" src={""} alt="company logo" />
      </div> */}
      <center>
        <div className="sidebar__department">{`${sidebarHeading} PORTAL`}</div>
      </center>
      <div className="sidebar-items">
        {sidebarItems.map((item, index) => {
          console.log(item,index)
          return (
          <NavLink
            activeClassName="active__sidebar"
            to={item.route}
            key={index}
          >
            <SidebarItem title={item.display_name} icon={item.icon} />
          </NavLink>
)})}
      </div>
    </div>
  );
};

export default Sidebar;

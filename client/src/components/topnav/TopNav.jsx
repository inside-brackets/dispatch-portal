import React from "react";
import "./topnav.css";
import { Link } from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import ThemeMenu from "../thememenu/ThemeMenu";
import user_image from "../../assets/images/taut.png";
import user_menu from "../../assets/JsonData/user_menus.json";
// import SearchBar from "../UI/SearchBar";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/White-Christmas.png";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";
import Badge from "../badge/Badge";
import company_status_map from "../../assets/JsonData/company.json";

const cookies = new Cookies();

const Topnav = () => {
  const { user, company } = useSelector((state) => state.user);
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedCompany");
    localStorage.removeItem("counters");
    cookies.remove("user");
  };

  // };
  const curr_user = {
    display_name: user.user_name,
    image: user.profile_image ?? user_image,
  };

  // const renderNotificationItem = (item, index) => (
  //   <div className="notification-item" key={index}>
  //     <i className={item.icon}></i>
  //     <span>{item.content}</span>
  //   </div>
  // );

  const renderUserToggle = (user) => (
    <div className="topnav__right-user">
      <div className="topnav__right-user__image">
        <img src={user.image} alt="" />
      </div>
      <div className="topnav__right-user__name">{user.display_name}</div>
    </div>
  );
  const renderUserMenu = (item, index) => (
    <Link key={index} to={item.to}>
      <div key={index}>
        <div
          onClick={item.content === "Logout" ? logout : () => {}}
          className="notification-item"
        >
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </div>
      </div>
    </Link>
  );
  return (
    <div className="topnav">
      {/* <SearchBar className="topnav__search" placeholder="Search here..." /> */}
      <div
        className={
          process.env.REACT_APP_FALCON === "true"
            ? `sidebar__logo_falcon`
            : "sidebar__logo"
        }
      >
        <img
          className="logo img-fluid"
          src={process.env.REACT_APP_FALCON === "true" ? logo : logo2}
          alt="company logo"
        />
      </div>
      <div className="topnav__right">
        <div className="bd-brand-item">
          <span className="h3">
            {user.department === "admin" || user.department === "HR" ? (
              <Badge
                type={company_status_map[company.value]}
                content={company.label}
              />
            ) : (
              ""
            )}
          </span>
        </div>
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        {/* <div className="topnav__right-item">
           
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div> */}
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default Topnav;

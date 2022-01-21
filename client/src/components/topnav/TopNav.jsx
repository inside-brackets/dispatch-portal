import React from "react";
import "./topnav.css";
import { Link } from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import ThemeMenu from "../thememenu/ThemeMenu";
import user_image from "../../assets/images/taut.png";
import user_menu from "../../assets/JsonData/user_menus.json";
import SearchBar from "../UI/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/user";
// import notifications from "../../assets/JsonData/notification.json";

const Topnav = () => {
  const { user, company } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(
      userActions.logout({
        cb: () => {
          localStorage.removeItem("user");
          localStorage.removeItem("selectedCompany")
        },
      })
    );
  };
  const curr_user = {
    display_name: user.user_name,
    image: user_image,
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
      <SearchBar className="topnav__search" placeholder="Search here..." />
      <div className="topnav__right">
        <div class="bd-brand-item">
          <span class="h3">
            {user.department === "admin" ? company.label : ""}
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

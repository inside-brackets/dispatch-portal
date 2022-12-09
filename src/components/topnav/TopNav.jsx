import React, { useState } from "react";
import "./topnav.css";
import { Link } from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import ThemeMenu from "../thememenu/ThemeMenu";
import user_image from "../../assets/images/taut.png";
import user_menu from "../../assets/JsonData/user_menus.json";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import FeedBackModal from "../modals/MyModal";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/White-Christmas.png";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { useDropzone } from "react-dropzone";
import emailjs from 'emailjs-com';
import axios from 'axios'

const cookies = new Cookies();

const Topnav = () => {
  const { user, company } = useSelector((state) => state.user);
  const [modal, setModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedCompany");
    localStorage.removeItem("counters");
    cookies.remove("user");
  };
  console.log(user,"user================================>")
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({});
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ))
  const submitHandler = async (e) => {
    setLoader(true)
    e.preventDefault();
    let arr = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      const { data: url } = await axios(
        `/s3url/email_documents/${user?.user_name
        }.${acceptedFiles[0].type.split("/")[1]}`
      );
      await axios.put(url, acceptedFiles[i]);
      arr[i] = `${url.split("?")[0]} `;
    }
    emailjs.send(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID,
      {
        user_name: user?.user_name,
        subject: e.target.subject.value,
        content: e.target.content.value,
        files: arr
      },
      process.env.REACT_APP_PUBLIC_MAILID
    ).then((response) => {
        setLoader(false)
        setModal(false)
        toast.success("Feedback Sent")
      })
      .catch((err) => {
        console.log('FAILED...', err);
      });


  }
  // const renderNotificationItem = (item, index) => (
  //   <div className="notification-item" key={index}>
  //     <i className={item.icon}></i>
  //     <span>{item.content}</span>
  //   </div>
  // );

  const onClose = () => {
    setModal(false);
    setLoader(false);
  }


  const renderUserToggle = (user) => (
    <div className="topnav__right-user">
      <div className="topnav__right-user__image">
        <img src={user.image} alt="" />
      </div>
      <div className="topnav__right-user__name">{user.display_name}</div>
    </div>
  );
  const renderUserMenu = (item, index) => 
  // {
  // console.log(!(user.department==="admin") && !(item.content === "Settings"))
  // return
  (<>
    {!(user.department==="admin") && !(item.content === "Settings") ?
    <Link key={index} to={item.to}>
      <div key={index}>
        <div
          onClick={item.content === "Logout" ? logout : item.content === "Feedback" ? feedbackmodal : () => { }}
          className="notification-item"
        >
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </div>
      </div>
    </Link>
   :  user.department==="admin" ?  <Link key={index} to={item.to}>
   <div key={index}>
     <div
       onClick={item.content === "Logout" ? logout : item.content === "Feedback" ? feedbackmodal : () => { }}
       className="notification-item"
     >
       <i className={item.icon}></i>
       <span>{item.content}</span>
     </div>
   </div>
 </Link>:null}
 </> )
//  };


  const curr_user = {
    display_name: user.user_name,
    image: user.profile_image ?? user_image,
  };
  const feedbackmodal = () => {
    setModal(true)
  }
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
          <span className="company_label falcon_label">
            {user.department === "admin" || user.department === "HR" ? (
              // <Badge
              //   type={company_status_map[company.value]}
              //   content={}
              // />
              <>

                {company.label}
              </>
            ) : (
              ""
            )}
          </span>
        </div>
      </div>
      <div className="topnav__right">
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
        <FeedBackModal
          show={modal}
          onClose={onClose}
          size="lg"
          heading="Need help? Found a bug? Have a Suggestion?">
          <Form
            onSubmit={submitHandler}
          >
            <Form.Group className="mb-3" controlId="deactivate_carrier">
              <p>If you've encountered a bug, need help regarding something or just have a suggestion for improvement, you've come to the right place.</p>
            </Form.Group>
            <Form.Group className="mb-3 subject-group" controlId="deactivate_carrier">
              <Form.Control
                className="subject_text"
                placeholder="Subject *"
                type="text"
                name="subject"
              />
            </Form.Group>

            <Form.Group className="mb-3 content_group" controlId="content">
              <Form.Label className="content_label">
                Content *
              </Form.Label>
              <Form.Control
                as="textarea"
                className="content_text"
                type="text"
                name="textarea"
                rows={8}
              />

            </Form.Group>
            <Form.Group className="mb-3 upload_file_group" controlId="deactivate_carrier">
              <div {...getRootProps({ className: "dropzone" })}>
                <input
                  className="input-zone"
                  {...getInputProps()}
                  type="file"
                  name="file"
                // onChange={drop}
                />
                <div className="text-center upload_drap_wrapper">


                  <button type="button" className="butn">
                    UPLOAD
                  </button>
                  {isDragActive ? (
                    <span className="drap_text">
                      Release to drop the files here
                    </span>
                  ) : (<>
                    <span className="drap_text"> OR drag and drop file here</span>
                  </>
                  )}


                </div>
                <aside>
                  <ul>{files}</ul>
                </aside>
              </div>
            </Form.Group>
            <div className="btn_feedback">
              <Button type="submit" disabled={loader}>
                {loader ? (
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )
                  : null}
                Send FeedBack</Button>
            </div>
          </Form>

        </FeedBackModal>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default Topnav;

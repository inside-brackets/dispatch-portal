import React from "react";
// import { Link } from "react-router-dom";
import usMap from "../../assets/images/us-map.jpg";
import UsClock from "../../components/usClock/UsClock";
// import { socket } from "../../index";
import {Row, Col} from 'react-bootstrap'
import MySelect from "../../components/UI/MySelect";
import { userActions } from "../../store/user";
import { themeActions } from "../../store/theme";
import { useSelector, useDispatch } from "react-redux";

const Dashboard = () => {
  // const notify = () => {
  //   socket.emit("notify", "test");
  // };
  const { company: selectedCompany } = useSelector((state) => state.user);
const dispatch = useDispatch()
  return (

      <Row className='my-4'>
        <Col md={4}>
        <MySelect
          isMulti={false}
          value={selectedCompany}
          onChange={(option) => {
            dispatch(userActions.changeCompany(option));
            var color =
              option.value === "elite" ? "theme-color-blue" : "theme-color-red";
            dispatch(themeActions.setColor(color));
            localStorage.setItem("selectedCompany", JSON.stringify(option));
          }}
          options={[
            {
              label: "Elite Dispatch Service",
              value: "elite",
            },
            {
              label: "Alpha Dispatch Solution",
              value: "alpha",
            },
          ]}
        />
        </Col>
      </Row>
  );
};

export default Dashboard;

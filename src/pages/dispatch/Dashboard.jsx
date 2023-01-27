import React from "react";
import { useSelector } from "react-redux";
import {Row,Col,Card} from "react-bootstrap"
import usMap from "../../assets/images/us-map.jpg";
import UsClock from "../../components/usClock/UsClock";
import axios from "axios";
import TargetDisplay from "../../components/targetDisplay/TargetDisplay";


const DashboardDispatch = () => {
    const { company: selectedCompany } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.user);
    return (
        <>
        <Row>
          <Col md={8}>
            <img className="main__img" src={usMap} alt="couldn't find" />
          </Col>
          <Col md={4}><UsClock /></Col>
        </Row>
      </>
    )
}

export default DashboardDispatch

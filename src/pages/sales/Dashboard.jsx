import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card } from "react-bootstrap"
import usMap from "../../assets/images/us-map.jpg";
import UsClock from "../../components/usClock/UsClock";
import axios from "axios";
import '../../assets/css/sales/dashboard.css';
import TargetDisplay from "../../components/targetDisplay/TargetDisplay";
import CarrierUpdates from "../../components/carrierUpdates/CarrierUpdates";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const { company: selectedCompany, user } = useSelector((state) => state.user);
  useEffect(() => {
    axios
      .post(`/admin/top-sales`, {
        company: selectedCompany.value,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));

  }, [])
  return (
    <>
      <Row>
        <Col md={8}>
          <img className="main__img" src={usMap} alt="couldn't find" />
        </Col>
        <Col md={4}>
          {user.department === "sales" ? (
            <TargetDisplay designation={user.designation} />
          ) : null}

        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <CarrierUpdates/>
        </Col>
        <Col md={4}>
          <Card
            style={{
              width: "auto",
              height: "465px",
              border: "light",
            }}
          >
            <Card.Body>
              <Card.Title>LeaderBoard</Card.Title>
              <hr />
              {!data || data.length === 0 ? (
                <>Not Enough Data to show</>
              ) : (
                <div>
                  <table >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Total Gross</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => {
                        return (
                          <tr
                            className={index === 0 && "bg-success text-white"}
                          >
                            <td>{index + 1}</td>
                            <td className="text-capitalize">
                              {item.user_name}
                            </td>
                            <td>{item.total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}><UsClock /></Col>
      </Row>
    </>
  );
};

export default Dashboard;

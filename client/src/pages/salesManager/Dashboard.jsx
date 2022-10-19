import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TargetDisplay from "../../components/targetDisplay/TargetDisplay";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Chart from "react-apexcharts";
import axios from "axios";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/settings/chart`)
      .then(({ data }) => {
        console.log(data);
        setSeries([
          {
            name: "Registered",
            data: data,
          },
        ]);
      });
  }, []);

  const options = {
    chart: {
      height: 370,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#349eff", "#019707"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Carriers Registered",
      align: "left",
    },
    grid: {
      borderColor: "#ececec",
      row: {
        colors: ["#f1f1f1", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
      title: {
        text: "Month",
      },
    },
    yaxis: {
      title: {
        text: "Carriers",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
  };

  return (
    <>
      <h2 className="page-header">Manager Dashboard</h2>
      <Row>
        <Col xl={8} lg={12}>
          <Card>
            <Card.Body>
              <Chart
                options={options}
                series={series}
                type="line"
                height={370}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={8} sm={12}>
          <TargetDisplay designation={user.designation} />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;

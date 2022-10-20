import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Chart from "react-apexcharts";
import axios from "axios";

import TargetDisplay from "../../components/targetDisplay/TargetDisplay";
import StatusCard from "../../components/status-card/StatusCard";
import MySelect from "../../components/UI/MySelect";
import { userActions } from "../../store/user";
import { themeActions } from "../../store/theme";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { company: selectedCompany } = useSelector((state) => state.user);

  const [series, setSeries] = useState([]);

  const dispatch = useDispatch();

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
    colors: ["var(--main-color)", "#019707"],
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
      {/* Slect Company & Heading */}
      <Row className="mb-3">
        <Col>
          <h2 className="page-header mb-3">Manager Dashboard</h2>
        </Col>
        <Col md={8} lg={6} xl={4} style={{ zIndex: 999 }}>
          <MySelect
            isMulti={false}
            value={selectedCompany}
            onChange={(option) => {
              dispatch(userActions.changeCompany(option));
              var color =
                option.value === "elite"
                  ? "theme-color-blue"
                  : "theme-color-red";
              dispatch(themeActions.setColor(color));
              localStorage.setItem("selectedCompany", JSON.stringify(option));
            }}
            options={[
              {
                label: "Company A",
                value: "elite",
              },
              {
                label: "Company B",
                value: "alpha",
              },
            ]}
          />
        </Col>
      </Row>
      {/* Status Cards */}
      <Row>
        <Col>
          <StatusCard title="Lorem ipsum" icon="bx bx-line-chart" count={23} />
        </Col>
        <Col>
          <StatusCard
            title="Lorem ipsum"
            icon="bx bx-calendar-check"
            count={16}
          />
        </Col>
        <Col>
          <StatusCard title="Lorem ipsum" icon="bx bx-time-five" count={2} />
        </Col>
        <Col>
          <StatusCard title="Lorem ipsum" icon="bx bxs-truck" count={100} />
        </Col>
        <Col>
          <StatusCard
            title="Lorem ipsum"
            icon="bx bx-calendar-check"
            count={89}
          />
        </Col>
      </Row>
      {/* Chart & Target Display */}
      <Row>
        <Col lg={12} xl={8}>
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
        <Col sm={12} md={8} lg={6} xl={4}>
          <TargetDisplay designation={user.designation} />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;

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
  const [pieChart, setPieChart] = useState([]);
  const [leads, setLeads] = useState(0);
  const [activeTrucks, setActiveTrucks] = useState(0);
  const [activeSalePersons, setActiveSalePersons] = useState(0);
  const [pendingSalePersons, setPendingSalePersons] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/settings/chart`)
      .then(({ data }) => {
        setSeries([
          {
            name: "Appointment",
            data: data.appointment,
          },
          {
            name: "Registered",
            data: data.registered,
          },
        ]);
        setPieChart(data.pieChart);
      });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/count/leads`,
      headers: { "Content-Type": "application/json" },
      data: {
        series: {
          isCustom: false,
        },
      },
    }).then(({ data }) => {
      setLeads(data);
    });
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/countcarriers`, {
        company: selectedCompany.value,
      })
      .then(({ data }) => {
        setActiveTrucks(data.activeTrucks);
      });
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/count/active/sales`)
      .then(({ data }) => {
        setActiveSalePersons(data);
      });
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/count/pending/sales`)
      .then(({ data }) => {
        setPendingSalePersons(data);
      });
  }, []);

  const lineChartOptions = {
    chart: {
      width: "100%",
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["rgb(248, 248, 0)", "var(--main-color-green)"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Growth",
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

  const pieChartOptions = {
    chart: {
      width: "100%",
      type: "pie",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [
      "var(--main-color-green)",
      "rgb(248, 248, 0)",
      "var(--main-color-red)",
    ],
    labels: ["Registered", "Appointment", "Rejected"],
    title: {
      text: "This Month",
      align: "center",
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <>
      {/* Slect Company & Heading */}
      <Row className="mb-3">
        <Col>
          <h2 className="page-header mb-3">Manager Dashboard</h2>
        </Col>
        <Col md={8} lg={6} xl={4} style={{ zIndex: 2 }}>
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
          <StatusCard title="Leads" icon="bx bx-data" count={leads} />
        </Col>
        <Col>
          <StatusCard
            title="Active Trucks"
            icon="bx bxs-truck"
            count={activeTrucks}
          />
        </Col>
        <Col>
          <StatusCard
            title="Sales Person"
            icon="bx bx-user"
            count={activeSalePersons}
          />
        </Col>
        <Col>
          <StatusCard
            title="Upcoming Sales Person"
            icon="bx bxs-user-plus"
            count={pendingSalePersons}
          />
        </Col>
      </Row>
      {/* Charts */}
      <Row>
        <Col lg={12} xl={8}>
          <Card style={{ minHeight: "400px" }}>
            <Card.Body>
              <Chart
                options={lineChartOptions}
                series={series}
                type="line"
                height={370}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={8} lg={6} xl={4}>
          <Card style={{ minHeight: "calc(100% - 15px)" }}>
            <Card.Body>
              <Chart
                options={pieChartOptions}
                series={pieChart}
                type="pie"
                height={410}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={8} lg={6} xl={4}>
          <TargetDisplay designation={user.designation} />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;

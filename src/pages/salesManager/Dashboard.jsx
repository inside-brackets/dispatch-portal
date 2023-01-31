import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Chart from "react-apexcharts";
import axios from "axios";

import StatusCard from "../../components/status-card/StatusCard";
import MySelect from "../../components/UI/MySelect";
import DetailsModal from "../../components/DetailsModal/DetailsModal";
import { userActions } from "../../store/user";
import { themeActions } from "../../store/theme";
import "./Dashboard.css";
import CarrierUpdates from "../../components/carrierUpdates/CarrierUpdates";

const Dashboard = () => {
  const { company: selectedCompany } = useSelector((state) => state.user);
  const [lineChart, setLineChart] = useState([]);
  const [pieChart, setPieChart] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [stats, setStats] = useState({
    leads: 0,
    activeTrucks: 0,
    activeSalePersons: 0,
    pendingSalePersons: 0,
  });
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchChart();
    fetchStats();
  }, []);

  const fetchChart = () => {
    axios.get(`/settings/chart`).then(({ data }) => {
      setLineChart([
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
      setTopUsers(data.users);
    });
  };

  const fetchStats = () => {
    axios({
      method: "POST",
      url: `/count/leads`,
      headers: { "Content-Type": "application/json" },
      data: {
        series: {
          isCustom: false,
        },
      },
    }).then(({ data }) => {
      setStats((prevState) => ({
        ...prevState,
        leads: data,
      }));
    });
    axios
      .post(`/countcarriers`, {
        company: selectedCompany.value,
      })
      .then(({ data }) => {
        setStats((prevState) => ({
          ...prevState,
          activeTrucks: data.activeTrucks,
        }));
      });
    axios.get(`/count/active/sales`).then(({ data }) => {
      setStats((prevState) => ({
        ...prevState,
        activeSalePersons: data,
      }));
    });
    axios.get(`/count/pending/sales`).then(({ data }) => {
      setStats((prevState) => ({
        ...prevState,
        pendingSalePersons: data,
      }));
    });
  };

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
    legend: {
      position: "bottom",
    },
    tooltip: {
      style: {
        fontSize: "16px",
      },
    },
  };

  return (
    <>
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
      <Row>
        <Col>
          <StatusCard title="Leads" icon="bx bx-data" count={stats.leads} />
        </Col>
        <Col>
          <StatusCard
            title="Active Trucks"
            icon="bx bxs-truck"
            count={stats.activeTrucks}
          />
        </Col>
        <Col>
          <StatusCard
            title="Sales Person"
            icon="bx bx-user"
            count={stats.activeSalePersons}
          />
        </Col>
        <Col>
          <StatusCard
            title="Upcoming Sales Person"
            icon="bx bxs-user-plus"
            count={stats.pendingSalePersons}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} xl={8}>
          <Card className="min-h-400">
            <Card.Body>
              <Chart
                options={lineChartOptions}
                series={lineChart}
                type="line"
                height={370}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={8} lg={6} xl={4}>
          <Card className="pie-card">
            <Card.Header
              as="h4"
              className="stat-header d-flex justify-content-between"
            >
              Stats
              <button className="details-btn" onClick={() => setShow(true)}>
                Details{">"}
              </button>
            </Card.Header>
            <Card.Body>
              <Chart
                options={pieChartOptions}
                series={pieChart}
                type="pie"
                height={370}
                id="pie-chart"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={4}>
              <CarrierUpdates/>
        </Col>
      </Row>
      <DetailsModal
        show={show}
        onHide={() => setShow(false)}
        users={topUsers}
        mSwitch={true}
      />
    </>
  );
};

export default Dashboard;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Chart from "react-apexcharts";
import StatusCard from "../../components/status-card/StatusCard";
import { useSelector, useDispatch } from "react-redux";
import MySelect from "../../components/UI/MySelect";
import { userActions } from "../../store/user";
import { themeActions } from "../../store/theme";
import CarrierUpdates from "../../components/carrierUpdates/CarrierUpdates";

const DashboardAdmin = () => {

  const [carriers, setCarriers] = useState({
    active: null,
    pending: null,
    appointment: null,
    carrier: null,
  });
  const [data, setData] = useState(null);
  const [topDispatcher, setTopDispatcher] = useState(null);
  const [lineChart, setLineChart] = useState([]);

  const { company: selectedCompany } = useSelector((state) => state.user);

  const dispatch = useDispatch();

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

  useEffect(() => {
    fetchChart();
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
    });
  };

  useEffect(() => {
    axios
      .post(`/countcarriers`, {
        company: selectedCompany.value,
      })
      .then(({ data }) => {
        setCarriers({
          carrier: data.total,
          appointment: data.appointments,
          active: data.activeTrucks,
          pending: data.pendingTrucks,
        });
      });

    axios
      .post(`/admin/top-sales`, {
        company: selectedCompany.value,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .post(`/admin/top-dispatcher`, {
        company: selectedCompany.value,
      })
      .then((res) => {
        setTopDispatcher(res.data);
      })
      .catch((err) => console.log(err));
  }, [selectedCompany]);

  return (
    <div>
      <Row className="my-4">
        <Col>
          <h2>Admin Dashboard</h2>
        </Col>
        <Col md={8} lg={6} xl={4} style={{ zIndex: 2 }}>
          {/* <Col md={4}> */}
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
                label:
                  process.env.REACT_APP_FALCON === "true"
                    ? "Elite Dispatch Service"
                    : "Company B",
                value: "elite",
              },
              {
                label:
                  process.env.REACT_APP_FALCON === "true"
                    ? "Alpha Dispatch Service"
                    : "Company A",
                value: "alpha",
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body style={{ padding: "0" }}>
              <Chart
                options={lineChartOptions}
                series={lineChart}
                type="line"
                height={250}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Row>
            <Col>
              <StatusCard
                title="Active Trucks"
                icon="bx bx-line-chart"
                count={carriers.active}
              />
            </Col>
            <Col>
              <StatusCard
                title=" Appointments"
                icon="bx bx-calendar-check"
                count={carriers.appointment}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <StatusCard
                title="Pendings Trucks"
                icon="bx bx-time-five"
                count={carriers.pending}
              />
            </Col>
            <Col>
              <StatusCard
                title="Total Carriers"
                icon="bx bxs-truck"
                count={carriers.carrier}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{marginTop:"22px"}}>
        <Col> <CarrierUpdates /> </Col>
        <Col>
          <Card
            style={{
              width: "auto",
              height: "480px",
              border: "light",
            }}
          >
            <Card.Body>
              <Card.Title>Top Dispatchers</Card.Title>
              <hr />
              {!topDispatcher || topDispatcher.length === 0 ? (
                <>Not Enough Data to show</>
              ) : (
                <div className="tableFixHead">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Total Gross</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topDispatcher.map((item, index) => {
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
        <Col>
          <Card
            style={{
              width: "auto",
              height: "480px",
              border: "light",
            }}
          >
            <Card.Body>
              <Card.Title>Sales Stats</Card.Title>
              <hr />
              {!data || data.length === 0 ? (
                <>Not Enough Data to show</>
              ) : (
                <div className="tableFixHead">
                  <table>
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
      </Row>
    </div>
  );
};

export default DashboardAdmin;

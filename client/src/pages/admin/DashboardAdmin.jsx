import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Chart from "react-apexcharts";
import StatusCard from "../../components/status-card/StatusCard";
import { useSelector, useDispatch } from "react-redux";
import MySelect from "../../components/UI/MySelect";
import { userActions } from "../../store/user";
import { themeActions } from "../../store/theme";

const DashboardAdmin = () => {
  const themeReducer = useSelector((state) => state.theme.mode);

  const [carriers, setCarriers] = useState(0);
  const [appointment, setAppointment] = useState(0);
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState(0);
  const [data, setData] = useState(null);
  const [topDispatcher, setTopDispatcher] = useState(null);

  const { company: selectedCompany } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const chartOptions = {
    series: [
      {
        name: "Online Customers",
        data: [40, 70, 20, 90, 36, 80, 30, 91, 60],
      },
      {
        name: "Store Customers",
        data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10],
      },
    ],
    options: {
      color: ["#6ab04c", "#2980b9"],
      chart: {
        background: "transparent",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
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
          "Sep",
        ],
      },
      legend: {
        position: "top",
      },
      grid: {
        show: false,
      },
    },
  };

  useEffect(() => {
    console.log("counting carriers");
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/countcarriers`, {
        company: selectedCompany.value,
      })
      .then((res) => {
        let data = res.data;
        setCarriers(data.total);
        setAppointment(data.appointments);
        setActive(data.activeTrucks);
        setPending(data.pendingTrucks);
      });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/admin/top-sales`, {
        company: selectedCompany.value,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/admin/top-dispatcher`, {
        company: selectedCompany.value,
      })
      .then((res) => {
        setTopDispatcher(res.data);
      })
      .catch((err) => console.log(err));
  }, [selectedCompany]);

  return (
    <div>
      <Row>
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
      </Row>
      <Row>
        <Col>
          <Card>
            <Chart
              // className="my-card"
              style={{
                width: "auto",
                height: "250px",
                border: "light",
              }}
              options={
                themeReducer === "theme-mode-dark"
                  ? {
                      ...chartOptions.options,
                      theme: { mode: "dark" },
                    }
                  : {
                      ...chartOptions.options,
                      theme: { mode: "light" },
                    }
              }
              series={chartOptions.series}
              type="line"
              height="100%"
            />
          </Card>
        </Col>
        <Col>
          <Row>
            <Col>
              <StatusCard
                title="Active Trucks"
                icon="bx bx-line-chart"
                count={active}
              />
            </Col>
            <Col>
              <StatusCard
                title=" Appointments"
                icon="bx bx-calendar-check"
                count={appointment}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <StatusCard
                title="Pendings Trucks"
                icon="bx bx-time-five"
                count={pending}
              />
            </Col>
            <Col>
              <StatusCard
                title="Total Carriers"
                icon="bx bxs-truck"
                count={carriers}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
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
              {!topDispatcher ? (
                <>Loading...</>
              ) : (
                <div class="tableFixHead">
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
              {!data ? (
                <>Loading...</>
              ) : (
                <div class="tableFixHead">
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

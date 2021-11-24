import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Chart from "react-apexcharts";
import StatusCard from "../../components/status-card/StatusCard";
import { useSelector,useDispatch } from "react-redux";
import MySelect from "../../components/UI/MySelect";
import { userActions } from "../../store/user";

const DashboardAdmin = () => {
  const themeReducer = useSelector((state) => state.theme.mode);

  const [carriers, setCarriers] = useState(0);
  const [appointment, setAppointment] = useState(0);
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState(0);

  const {company:selectedCompany} = useSelector((state)=>state.user)
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
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/countcarriers`)
      .then((res) => {
        console.log("response.data:", res.data);
        let data = res.data;
        setCarriers(data.total);
        setAppointment(data.appointments);
        setActive(data.activeTrucks);
        setPending(data.pendingTrucks);
      });
  }, []);

  return (
    <div>
    <Row>
      <MySelect
        isMulti={false}
        value={selectedCompany}
        onChange={(option)=>{
          dispatch(userActions.changeCompany(option))
        }}
        options={[
          {
            label: "Elite", 
            value: "elite",
        },
       {
            label: "Alpha", 
            value: "alpha",
        }
         ] }
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
                title="Total Active"
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
                title="Pendings"
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
            className="my-card"
            style={{
              width: "auto",
              height: "280px",
              border: "light",
            }}
          >
            <Card.Body>
              <Card.Title>Top Dispatchers</Card.Title>
              <hr />
              <Card.Text className="">Top Dispatchers</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card
            className="my-card"
            style={{
              width: "auto",
              height: "280px",
              border: "light",
            }}
          >
            <Card.Body>
              <Card.Title>Sales Stats</Card.Title>
              <hr />
              <Card.Text className="">Sales Stats</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;

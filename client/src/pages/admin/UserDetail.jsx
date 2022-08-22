import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Alert, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import moment from "moment";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Label,
} from "recharts";

import Documents from "../Documents";
import Badge from "../../components/badge/Badge";
import status_map from "../../assets/JsonData/status_map.json";
import user_image from'../../assets/images/taut.png'

const UserDetailPage = ({ user }) => {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(`Loading`);

  let totalLenght = 0;
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/registered-and-rejected`,
        {
          user_id: user._id,
          change: ["rejected", "registered", "appointment"],
        }
      )
      .then((res) => {
        totalLenght = res.data.length;
        const rejected = res.data.filter(
          (carrier) => carrier.change === "rejected"
        );
        const registered = res.data.filter(
          (carrier) => carrier.change === "registered"
        );
        const appointment = res.data.filter(
          (carrier) => carrier.change === "appointment"
        );

        if (
          rejected.length === 0 &&
          registered.length === 0 &&
          appointment.length === 0
        ) {
          setMessage(`Not enough data to show in graph`);
        } else {
          setData([
            { name: "Registered", value: registered.length },
            { name: "Rejected", value: rejected.length },
            { name: "Appointment", value: appointment.length },
          ]);
        }
      })
      .catch((err) => console.log(err));
  }, [user._id]);

  function CustomLabel({ viewBox, value1, value2 }) {
    const { cx, cy } = viewBox;
    const sum = value1.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.value;
    }, 0);
    return (
      <text
        x={cx}
        y={cy}
        fill="#3d405c"
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan alignmentBaseline="middle" fontSize="26">
          {sum}
        </tspan>
        <br />
        <tspan fontSize="14">{value2}</tspan>
      </text>
    );
  }

  const data01 = [
    {
      name: "month",
      salary: 4000,
      dispactherFee: 2400,
    },
    {
      name: "month",
      salary: 3000,
      dispactherFee: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      salary: 2000,
      dispactherFee: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      salary: 2780,
      dispactherFee: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      salary: 1890,
      dispactherFee: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      salary: 2390,
      dispactherFee: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      salary: 3490,
      dispactherFee: 4300,
      amt: 2100,
    },
  ];

  const COLORS = ["#00FF00", "#FF0000", "#FFFF00"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Row className="justify-content-center">
      <Col>
        <Card style={{ border: "none", minHeight: "100vh" }}>
          <Form>
            <Row className="m-3">
              <h1 className="text-center">User Detail</h1>
              <hr />
              <Col md={2}>
                <div className="container">
                  <div className="circle">
                    <img src={user.profile_image ?? user_image} alt="." />
                  </div>
                </div>
              </Col>
              <Form.Group as={Col} md="4" className="mt-4">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  aria-describedby="inputGroupPrepend"
                  value={user.user_name}
                  name="user_name"
                  required
                />
                 <Badge className="rounded-0 mt-4" type={status_map[user.u_status]} content={user.u_status} />
              </Form.Group>
             
            </Row>
            <hr />

            <Row className="m-3">
              <h3>Personel Info</h3>
              <Form.Group as={Col} md="6">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  name="first_name"
                  value={user.first_name}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  value={user.last_name}
                  placeholder="Last name"
                  name="last_name"
                />
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Phone #</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone #"
                  name="phone_number"
                  value={user.phone_number}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={user.address}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  Value={
                    user.date_of_birth
                      ? moment(user.date_of_birth).format("YYYY-MM-DD")
                      : ""
                  }
                />
              </Form.Group>
            </Row>
            <hr />
            <Row className="m-3">
              <h3>Company Info</h3>
              <Form.Group as={Col} md="6">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Department"
                  name="first_name"
                  value={user.department}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  value={user.designation}
                  placeholder="Last name"
                  name="last_name"
                />
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Salary"
                  name="salary"
                  value={user.salary}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  Value={
                    user.joining_date
                      ? moment(user.joining_date).format("YYYY-MM-DD")
                      : ""
                  }
                />
              </Form.Group>
            </Row>
          </Form>
        </Card>
        {user.department === "sales" && (
          <Card>
            <Row>
              <h1 className="text-center">Stats</h1>
              <Col md={6}>
                <h3>Monthly Dialing report</h3>
              </Col>
              <Col md={6}>
                <h3>Profit Loss Analysis</h3>
              </Col>
              <Col md={6} style={{ textAlign: "-webkit-center" }}>
                {!data ? (
                  <Alert variant="primary">{message}</Alert>
                ) : (
                  <PieChart width={400} height={400}>
                    <Pie
                      data={data}
                      cx={120}
                      cy={200}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      <Label
                        width={30}
                        position="center"
                        content={<CustomLabel value1={data} value2="Total" />}
                      ></Label>
                    </Pie>
                    <Tooltip />
                    <Legend align="left" />
                  </PieChart>
                )}
              </Col>
              <Col md={6}>
                <h5 className="text-center"> Coming soon.</h5>
                <BarChart
                  width={500}
                  height={300}
                  data={data01}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="dispactherFee" stackId="a" fill="#8884d8" />
                  <Bar dataKey="salary" stackId="a" fill="#82ca9d" />
                </BarChart>
              </Col>
            </Row>
          </Card>
        )}
      </Col>
    </Row>
  );
};

function UserDetail() {
  const history = useHistory()
  const params = useParams();
const location = useLocation()
  let query = new URLSearchParams(location.search);
  let keyName = query.get('key') ? query.get('key') : "info";
  const [key, setKey] = useState(keyName);

  const [user, setUser] = useState(null);
  const [reCall, setReCall] = useState(null)


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/getuser/${params.id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [reCall]);
  return !user ? (
    <div className="spreadsheet__loader">
      <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
    </div>
  ) : (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => {setKey(k)
        history.push(`/user/${params.id}?key=${k}`)}}
      justify
    >
      <Tab eventKey="info" title="Basic Information">
        <UserDetailPage user={user} />
      </Tab>
      <Tab eventKey="documents" title="Documents">
        <Documents callBack={()=> setReCall(Math.random())} user={user} />
      </Tab>
    </Tabs>
  );
}
export default UserDetail;

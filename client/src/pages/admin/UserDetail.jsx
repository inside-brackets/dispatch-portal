import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Form,
  Alert,
  Tab,
  Tabs,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
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
import user_image from "../../assets/images/taut.png";
import { socket } from "../../index";
import DeleteConfirmation from "../../components/modals/DeleteConfirmation";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";

const UserDetailPage = ({ user, callBack }) => {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(`Loading`);
  const [state, setState] = useState(user);
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);
  const [usernameIsValid, setUsernameIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);

  const { department } = useSelector((state) => state.user.user);

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;

    setState({
      ...state,
      [name]: value,
    });
  };
  const handleReset = async () => {
    const pass = "12345";
    const reHash = await bcrypt.hash(pass, 8);

    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/updateuser/${user._id}`, {
        password: reHash,
      })
      .then((response) => {
        toast.success("Password has been successfully reset");
        setShowModal(false);
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      setLoading(true);
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/updateuser/${user._id}`, {
          user_name: state.user_name.replace(/\s+/g, " ").trim(),
          joining_date: new Date(state.joining_date),
          salary: state.salary,
          designation: state.designation,
          department: state.department,
          u_status: state.u_status,
        })
        .then((response) => {
          toast.success("Successfully updated user");
          if (response.data.u_status === "fired") {
            socket.emit("user-fired", `${state._id}`);
          }
          setEditable(false);
          setLoading(false);
          callBack();
        })
        .catch((err) => toast.error(err));
    }
  };

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

  // const RADIAN = Math.PI / 180;
  // const renderCustomizedLabel = ({
  //   cx,
  //   cy,
  //   midAngle,
  //   innerRadius,
  //   outerRadius,
  //   percent,
  //   index,
  // }) => {
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

  //   return (
  //     <text
  //       x={x}
  //       y={y}
  //       fill="white"
  //       textAnchor={x > cx ? "start" : "end"}
  //       dominantBaseline="central"
  //     >
  //       {`${(percent * 100).toFixed(0)}%`}
  //     </text>
  //   );
  // };
  useEffect(() => {
    if (state.user_name) {
      console.log(state.user_name);
      const indentifier = setTimeout(async () => {
        // if (userName !== defaultValue?.user_name) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/getusers`,
          {
            user_name: state.user_name
              .replace(/\s+/g, " ")
              .trim()
              .toLowerCase(),
          }
        );
        console.log("checking username", response.data);
        if (state.user_name !== response.data[0]?.user_name) setShowError(true);
        setUsernameIsValid(response.data.length === 0);
      }, 500);
      return () => {
        clearTimeout(indentifier);
      };
    }
  }, [state.user_name]);

  return (
    <Row className="justify-content-center">
      <Col>
        <Card style={{ border: "none", minHeight: "100vh" }}>
          <Form onSubmit={handleSubmit}>
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
                  className={`${
                    showError && editable && state.user_name && !usernameIsValid
                      ? "invalid is-invalid"
                      : ""
                  } no__feedback shadow-none`}
                  value={state.user_name}
                  onChange={handleChange}
                  type="text"
                  readOnly={!editable}
                  placeholder="Enter username"
                  name="user_name"
                />
                {editable &&
                showError &&
                usernameIsValid !== null &&
                usernameIsValid ? (
                  <Form.Text style={{ color: "green" }}>
                    Username is available!
                  </Form.Text>
                ) : (
                  editable &&
                  showError &&
                  usernameIsValid === false && (
                    <Form.Text style={{ color: "red" }}>
                      Whoops! username already exists.
                    </Form.Text>
                  )
                )}

                <Row>
                  <Col md={2}>
                    <Badge
                      className="rounded-0 mt-4"
                      type={status_map[user.u_status]}
                      content={user.u_status}
                    />
                  </Col>
                </Row>
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
                  readOnly
                  name="first_name"
                  value={user.first_name}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={user.last_name}
                  placeholder="Last name"
                  name="last_name"
                />
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Phone #</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  placeholder="Phone #"
                  name="phone_number"
                  value={user.phone_number}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
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
                  readOnly
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
                  as="select"
                  value={state.department}
                  onChange={handleChange}
                  disabled={!editable}
                  name="department"
                  required
                >
                  <option value={null}></option>
                  <option value="sales">Sales</option>
                  <option value="dispatch">Dispatch</option>
                  {/* <option value="accounts">Accounts</option> */}
                  <option value="HR">HR</option>
                  {user.department !== "HR" && (
                    <option value="admin">Admin</option>
                  )}
                </Form.Control>

                <Form.Control.Feedback type="invalid">
                  Please provide a valid Department.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  as="select"
                  value={state.designation}
                  readOnly={!editable}
                  onChange={handleChange}
                  name="designation"
                  required
                >
                  <option value={null}>Select Department</option>
                  <option value="Company">Company</option>
                  <option value="Manager">Manager</option>
                  <option value="Senior Employee">Senior Employee</option>
                  <option value="Junior Employee">Junior Employee</option>
                  <option value="Team Lead">Team Lead</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Salary"
                  name="salary"
                  readOnly={!editable}
                  value={state.salary}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Joining Date</Form.Label>
                <Form.Control
                  type="date"
                  readOnly={!editable}
                  name="joining_date"
                  Value={
                    state.joining_date
                      ? moment(user.joining_date).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={state.u_status}
                  onChange={handleChange}
                  disabled={!editable}
                  name="u_status"
                  required
                >
                  <option value={null}></option>
                  <option value="active">Active</option>
                  <option value="fired">Fired</option>
                  <option value="inactive">Inactive</option>
                </Form.Control>

                <Form.Control.Feedback type="invalid">
                  Please provide a valid Status.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            {department === "admin" && (
              <Row className="my-5">
                {editable && (
                  <Col md={2}>
                    <Button
                      className="w-100 p-2"
                      variant="outline-success"
                      disabled={loading}
                      type="submit"
                    >
                      Save
                    </Button>
                  </Col>
                )}

                <Col md={2}>
                  <Button
                    className="w-100 p-2"
                    variant={`outline-${!editable ? "primary" : "danger"}`}
                    disabled={loading}
                    onClick={() => setEditable(!editable)}
                  >
                    {!editable ? "Edit" : "Close"}
                  </Button>
                </Col>
                <Col></Col>
                <Col className="float-right" md={2}>
                  <Button
                    className="w-100 p-2"
                    variant="warning"
                    disabled={loading || editable}
                    onClick={() => setShowModal(true)}
                  >
                    Reset Password
                  </Button>
                </Col>

                <DeleteConfirmation
                  showModal={showModal}
                  confirmModal={handleReset}
                  hideModal={() => setShowModal(false)}
                  message={"Are you sure to want to Reset Password to 12345?"}
                  title="Reset Confirmation"
                />
              </Row>
            )}
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
  const params = useParams();

  const [key, setKey] = useState("info");

  const [user, setUser] = useState(null);
  const [reCall, setReCall] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/getuser/${params.id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [reCall, params.id]);
  return !user ? (
    <div className="spreadsheet__loader">
      <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
    </div>
  ) : (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      justify
    >
      <Tab eventKey="info" title="Basic Information">
        <UserDetailPage user={user} callBack={() => setReCall(Math.random())} />
      </Tab>
      <Tab eventKey="documents" title="Documents">
        <Documents callBack={() => setReCall(Math.random())} user={user} />
      </Tab>
    </Tabs>
  );
}
export default UserDetail;

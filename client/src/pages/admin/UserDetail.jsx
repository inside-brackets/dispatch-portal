import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import moment from "moment";
import { PieChart, Pie, Cell, Tooltip,ResponsiveContainer } from "recharts";

const UserDetail = () => {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/getuser/${params.id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/registered-and-rejected`,
        {
          user_id: params.id,
          change: ["rejected", "registered"],
        }
      )
      .then((res) => {
        const rejected = res.data.filter(
          (carrier) => carrier.change === "rejected"
        );
        const registered = res.data.filter(
          (carrier) => carrier.change === "registered"
        );
        setData([
          { name: "Registered", value: registered.length },
          { name: "Rejected", value: rejected.length },
        ]);
      })
      .catch((err) => console.log(err));
  }, [params.id]);

  const COLORS = ["#0088FE", "#00C49F"];

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
    <Row>
      {!user ? (
        <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
      ) : (
        <Col>
          <Card>
            <Form>
              <Row className="m-3">
                <h1 className="text-center">User Detail Page</h1>
                <Form.Group as={Col} md="6">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    aria-describedby="inputGroupPrepend"
                    value={user.user_name}
                    name="user_name"
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>User Status</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="user_status"
                    value={user.u_status}
                    required
                  />
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
            <Row>
              {!data ? (
                <p>Loadingg</p>
              ) : (
                // <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={400} height={400}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
// {/* </ResponsiveContainer> */}
              )}
            </Row>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default UserDetail;

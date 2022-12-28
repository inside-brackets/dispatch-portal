import { useState, useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useSelector } from "react-redux";

import Table from "react-bootstrap/Table";

const NewUserForm = ({ refreshTable, closeModal }) => {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [availability, setAvailability] = useState(false);
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState(30000);
  const [joiningDate, setJoiningDate] = useState(null);

  const { company: selectedCompany, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (username.length > 0) {
      const indentifier = setTimeout(async () => {
        const response = await axios.post(`/getusers`, {
          user_name: username.replace(/\s+/g, " ").trim().toLowerCase(),
        });
        setAvailability(response.data.length === 0);
      }, 500);
      return () => {
        clearTimeout(indentifier);
      };
    }
  }, [username]);

  const validateForm = () => {
    let voilations = {};

    if (!availability) {
      voilations.username = "Please enter a unique Username!";
    }
    if (password.length === 0) {
      voilations.password = "Please enter a Password!";
    }
    if (department.length === 0) {
      voilations.department = "Please select a Department!";
    }
    if (designation.length === 0) {
      voilations.designation = "Please select a Designation!";
    }
    if (salary === 0) {
      voilations.salary = "Please enter a Salary!";
    }
    if (!joiningDate) {
      voilations.joinDate = "Please enter Joining Date!";
    }

    return voilations;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const voilations = validateForm();

    if (Object.keys(voilations).length > 0) {
      setErrors(voilations);
    } else {
      setValidated(true);
      const hash = await bcrypt.hash(password, 8);

      if (form.checkValidity()) {
        setLoading(true);
        await axios
          .post(`/admin/createuser`, {
            user_name: username.replace(/\s+/g, " ").trim().toLowerCase(),
            password: hash,
            department,
            designation,
            salary,
            joining_date: new Date(joiningDate),
            company: department === "admin" ? "falcon" : selectedCompany.value,
          })
          .then(({ data }) => {
            console.log(data);
            refreshTable();
            closeModal();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="justify-content-center">
        <Row className="m-3">
          <Form.Group as={Col} md={6}>
            <Form.Label>Username</Form.Label>
            <Form.Control
              className={`${
                username.length > 0 && !availability ? "invalid is-invalid" : ""
              }`}
              value={username}
              type="text"
              placeholder="Enter username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              isInvalid={!!errors.username}
              required
            />
            {username.length > 0 && availability && (
              <Form.Text style={{ color: "green" }}>
                Username is available!
              </Form.Text>
            )}
            {username.length > 0 && !availability && (
              <Form.Text style={{ color: "red" }}>
                Whoops! username already exists.
              </Form.Text>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={6}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
      </Row>
      <Row className="justify-content-center mb-3">
        <Row className="m-3">
          <hr />
          <h3 style={{ fontSize: "18px" }}>Additional Info</h3>
          <Form.Group as={Col} md={6}>
            <Form.Label>Department</Form.Label>
            <Form.Control
              as="select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              isInvalid={!!errors.department}
              required
            >
              <option value="">Select Department</option>
              <option value="sales">Sales</option>
              <option value="dispatch">Dispatch</option>
              <option value="accounts">Accounts</option>
              <option value="HR">HR</option>
              {user.department !== "HR" && <option value="admin">Admin</option>}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.department}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={6}>
            <Form.Label>Designation</Form.Label>
            <Form.Control
              as="select"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              isInvalid={!!errors.designation}
              required
            >
              <option value="">Select Designation</option>
              <option value="company">Company</option>
              <option value="manager">Manager</option>
              <option value="team_lead">Team Lead</option>
              <option value="employee">Employee</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.designation}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} md={6}>
            <Form.Label>Basic Salary</Form.Label>
            <Form.Control
              value={salary}
              type="number"
              placeholder="Salary"
              onChange={(e) => setSalary(Number(e.target.value))}
              isInvalid={!!errors.salary}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.salary}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={6}>
            <Form.Label>Joining Date</Form.Label>
            <Form.Control
              value={joiningDate}
              type="date"
              placeholder="Joining date"
              onChange={(e) => setJoiningDate(e.target.value)}
              isInvalid={!!errors.joinDate}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.joinDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
      </Row>
      {department === "dispatch" && (
        <Row className="justify-content-center mb-3">
          <Row className="m-3">
            <hr />
            <h3 style={{ fontSize: "18px" }}>Default Salary Slots</h3>
            <Table hover>
              <thead>
                <tr>
                  <th className="text-center">No.</th>
                  <th>Slot</th>
                  <th className="text-center">Lower Bound</th>
                  <th className="text-center">Upper Bound</th>
                  <th className="text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td>First</td>
                  <td className="text-center">1500</td>
                  <td className="text-center">4500</td>
                  <td className="text-center">8%</td>
                </tr>
                <tr>
                  <td className="text-center">2</td>
                  <td>Second</td>
                  <td className="text-center">-</td>
                  <td className="text-center">7000</td>
                  <td className="text-center">10%</td>
                </tr>
                <tr>
                  <td className="text-center">3</td>
                  <td>Third</td>
                  <td className="text-center">-</td>
                  <td className="text-center">9999999</td>
                  <td className="text-center">12%</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Row>
      )}
      <hr />
      <Button disabled={loading} type="submit">
        Add User
      </Button>
    </Form>
  );
};

export default NewUserForm;

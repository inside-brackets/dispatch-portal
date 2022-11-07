import axios from "axios";

import { useState, useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import bcrypt from "bcryptjs";
import { useSelector } from "react-redux";
import Select from "react-select";
import { socket } from "../../index";
import Table from "react-bootstrap/Table";

const NewUserForm = ({
  data,
  defaultValue,
  setShowModal,
  setEditModal,
  setRefresh,
  interview,
}) => {
  const [validated, setValidated] = useState(false);
  const [usernameIsValid, setUsernameIsValid] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [userName, setUserName] = useState(
    defaultValue ? defaultValue.user_name : null
  );
  const [password, setPassword] = useState(
    defaultValue ? defaultValue.password : null
  );
  const [department, setDepartment] = useState(
    defaultValue ? defaultValue.department : "sales"
  );
  const [designation, setDesignation] = useState(
    defaultValue ? defaultValue.designation : "Employee"
  );
  const [salary, setSalary] = useState(
    defaultValue ? defaultValue.salary : 30000
  );
  const [joiningDate, setJoiningDate] = useState(
    defaultValue ? new Date(defaultValue.joining_date) : null
  );
  const [userStatus, setUserStatus] = useState(
    defaultValue
      ? {
          label: defaultValue.u_status,
          value: defaultValue.u_status,
        }
      : null
  );
  const { company: selectedCompany, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (userName) {
      const indentifier = setTimeout(async () => {
        if (userName !== defaultValue?.user_name) {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/getusers`,
            { user_name: userName.replace(/\s+/g, " ").trim().toLowerCase() }
          );
          console.log("checking username", response.data);
          setUsernameIsValid(response.data.length === 0);
        } else {
          setUsernameIsValid(true);
        }
      }, 500);
      return () => {
        clearTimeout(indentifier);
      };
    }
  }, [userName, defaultValue]);

  const handleReset = async () => {
    const pass = "12345";
    const reHash = await bcrypt.hash(pass, 8);

    await axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/updateuser/${defaultValue._id}`,
        {
          password: reHash,
        }
      )
      .then((response) => {
        setRefresh(Math.random());
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);

    const hash = await bcrypt.hash(password, 8);

    if (form.checkValidity() === true) {
      if (defaultValue && !interview) {
        setButtonLoader(true);
        await axios
          .post(
            `${process.env.REACT_APP_BACKEND_URL}/updateuser/${defaultValue._id}`,
            {
              user_name: userName.replace(/\s+/g, " ").trim(),
              joining_date: new Date(joiningDate),
              salary,
              designation,
              department,
              u_status: userStatus.value,
            }
          )
          .then((response) => {
            if (response.data.u_status === "fired") {
              socket.emit("user-fired", `${defaultValue._id}`);
            }
            setRefresh(Math.random());
            setEditModal(false);
          });
      } else if (usernameIsValid) {
        setButtonLoader(true);
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/admin/createuser`, {
            user_name: userName.replace(/\s+/g, " ").trim().toLowerCase(),
            password: hash,
            joining_date: new Date(joiningDate),
            salary,
            designation,
            department,
            company: department === "admin" ? "falcon" : selectedCompany.value,
            ...defaultValue,
          })
          .then((response) => {
            console.log("response", response);
            setRefresh(Math.random());
            setShowModal(false);
            console.log(selectedCompany);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="m-3">
        <Form.Group as={Col} md="6">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            className={`${
              userName && !usernameIsValid ? "invalid is-invalid" : ""
            } no__feedback shadow-none`}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            type="text"
            placeholder="Enter username"
          />
          {usernameIsValid && userName && (
            <Form.Text style={{ color: "green" }}>
              Username is available!
            </Form.Text>
          )}
          {usernameIsValid === false && userName && (
            <Form.Text style={{ color: "red" }}>
              Whoops! username already exists.
            </Form.Text>
          )}
        </Form.Group>
        {defaultValue && !interview ? (
          <Button
            as={Col}
            md="3"
            className="mt-4 ms-5"
            style={{
              height: "45px",
              borderRadius: "30px",
              display: "inline-flex",
              alignItems: "center ",
            }}
            onClick={handleReset}
          >
            <i className="bx bx-reset"></i>
            Reset Password
          </Button>
        ) : (
          <Form.Group as={Col} md="6">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Row>
      <Row
        className={`justify-content-center ${
          department === "dispatch" ? "" : "mb-3"
        }`}
      >
        <Row className="m-3">
          {!defaultValue && <hr />}
          <h3>Company Info</h3>
          <Form.Group as={Col} md="6">
            <Form.Label>Department</Form.Label>
            <Form.Control
              as="select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value={null}>Select Department</option>
              <option value="sales">Sales</option>
              <option value="dispatch">Dispatch</option>
              {/* <option value="accounts">Accounts</option> */}
              <option value="HR">HR</option>
              {user.department !== "HR" && <option value="admin">Admin</option>}
            </Form.Control>

            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              as="select"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            >
              <option value={null}>Select Designation</option>
              <option value="company">Company</option>
              <option value="manager">Manager</option>
              <option value="team_lead">Team Lead</option>
              <option value="employee">Employee</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please provide a valid Designation.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="m-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Basic Salary</Form.Label>
            <Form.Control
              type="number"
              placeholder="Salary"
              value={salary}
              disabled={user._id === defaultValue?._id}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Salary.
            </Form.Control.Feedback>
          </Form.Group>
          {!defaultValue || interview ? (
            <Form.Group as={Col} md="6">
              <Form.Label>Joining Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Joining date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Date.
              </Form.Control.Feedback>
            </Form.Group>
          ) : (
            <Form.Group as={Col} md="6">
              <Form.Label>User Status</Form.Label>
              <Select
                label="Region"
                value={userStatus}
                onChange={setUserStatus}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Fired", value: "fired" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Date.
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </Row>
      </Row>
      {department === "dispatch" && (
        <Row className="mb-3 justify-content-center">
          <Row className="m-3">
            <hr />
            <h3 className="mb-3">Default Salary Slots</h3>
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
      {defaultValue ? (
        <Button disabled={buttonLoader} type="submit">
          Edit form
        </Button>
      ) : (
        <Button disabled={buttonLoader} type="submit">
          Submit form
        </Button>
      )}
    </Form>
  );
};

export default NewUserForm;

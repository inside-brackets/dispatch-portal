import axios from "axios";
import { useState, useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";

import { useSelector } from "react-redux";

const NewUserForm = ({
  data,
  defaultValue,
  setShowModal,
  setEditModal,
  setRefresh,
}) => {
  const [validated, setValidated] = useState(false);
  const [usernameIsValid, setUsernameIsValid] = useState(null);
  const [userName, setUserName] = useState(
    defaultValue ? defaultValue.user_name : null
  );
  const [password, setPassword] = useState(
    defaultValue ? defaultValue.password : null
  );
  const [department, setDepartment] = useState(
    defaultValue ? defaultValue.department : null
  );
  const [designation, setDesignation] = useState(
    defaultValue ? defaultValue.designation : null
  );
  const [salary, setSalary] = useState(
    defaultValue ? defaultValue.salary : null
  );
  const [joiningDate, setJoiningDate] = useState(
    defaultValue ? defaultValue.joining_date : null
  );
  const [sameName, setSameName] = useState(null);

  const { company: selectedCompany } = useSelector((state) => state.user);

  useEffect(() => {
    const indentifier = setTimeout(async () => {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/getuser`,
        { user_name: userName.toLowerCase() }
      );
      console.log("checking username");
      console.log(response.data);
      console.log(userName);
      setUsernameIsValid(response.data.length === 0);
    }, 500);
    return () => {
      clearTimeout(indentifier);
    };
  }, [userName]);

  // const onChangeHandler = (e) => {
  //   var sameName1 = data.find((item) => {
  //     return item.user_name.toLowerCase() === userName.toLowerCase();
  //   });
  //   setSameName(sameName1);
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      if (defaultValue) {
        console.log(
          "defaulvalue",
          salary,
          department,
          userName,
          password,
          designation,
          joiningDate
        );
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/updateuser`, {
            id: defaultValue._id,
            user_name: userName,
            password,
            joining_date: joiningDate,
            salary,
            designation,
            department,
          })
          .then((response) => {
            setRefresh(Math.random());
            setEditModal(false);
          });
      } else if (usernameIsValid) {
        console.log(
          "value",
          defaultValue,
          salary,
          department,
          userName,
          password,
          designation,
          joiningDate,
          sameName
        );
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/admin/createuser`, {
            user_name: userName,
            password,
            joining_date: joiningDate,
            salary,
            designation,
            department,
            company: selectedCompany.value,
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
      {!defaultValue && (
        <Row className="m-3">
          {/* <Form.Group as={Col} md="6">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => onChangeHandler()}
                required
              />
              {sameName && (
                <Form.Control.Feedback type="invalid">
                  user Name should be unique
                </Form.Control.Feedback>
              )}
              {!userName && (
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
              )}
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </InputGroup>
          </Form.Group> */}
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
        </Row>
      )}
      <Row className="mb-3 justify-content-center">
        <Row className="m-3">
          {!defaultValue && <hr />}
          <h1>Company Info</h1>
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
              {/* <option value="HR">HR</option> */}
              <option value="admin">Admin</option>
            </Form.Control>

            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              type="text"
              placeholder="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
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
              onChange={(e) => setSalary(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Salary.
            </Form.Control.Feedback>
          </Form.Group>
          {!defaultValue && (
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
          )}
        </Row>
      </Row>
      {defaultValue ? (
        <Button type="submit">Edit form</Button>
      ) : (
        <Button type="submit">Submit form</Button>
      )}
    </Form>
  );
};

export default NewUserForm;

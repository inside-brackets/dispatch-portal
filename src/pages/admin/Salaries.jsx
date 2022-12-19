import React, { useState } from "react";
import { Button, Col, Row, Card } from "react-bootstrap";
import moment from "moment";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Table from "../../components/table/SmartTable";

const getYears = () => {
  const YEAR = new Date().getFullYear();
  const STARTING_YEAR = 2022;
  const years = Array.from(
    new Array(YEAR - STARTING_YEAR + 1),
    (val, index) => index + STARTING_YEAR
  );
  return years;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Salaries = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() - 1);

  const history = useHistory();
  const { company: selectedCompany } = useSelector((state) => state.user);

  const generateSalary = (id) => {
    history.push("/salary/" + year + "/" + month + "/" + id);
  };

  const customerTableHead = [
    "#",
    "User Name",
    "Phone #",
    "Email",
    "Designation",
    "Department",
    "Joining Date",
    "Basic Salary",
    "Last Paid",
    "",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.user_name}</td>
      <td>{item.phone_number ? item.phone_number : "N/A"}</td>
      <td>{item.email_address ? item.email_address : "N/A"}</td>
      <td>{item.designation}</td>
      <td>{item.department}</td>
      <td>{moment(item.joining_date).format("ll")}</td>
      <td>{item.salary}</td>
      <td>{item.lastPaid ? moment(item.date).format("MMMM") : "N/A"}</td>
      <td>
        <Button type="view" onClick={() => generateSalary(item._id)}>
          Generate
        </Button>
      </td>
    </tr>
  );

  return (
    <>
      <Row className="mb-3">
        <Col md={3}>
          <label htmlFor="yearSelect" className="form-label">
            Year
          </label>
          <select
            name="yearSelect"
            id="yearSelect"
            value={year}
            className="form-select"
            onChange={(e) => setYear(e.target.value)}
          >
            {getYears().map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Col>
        <Col md={3}>
          <label htmlFor="monthSelect" className="form-label">
            Month
          </label>
          <select
            name="monthSelect"
            id="monthSelect"
            value={month}
            className="form-select"
            onChange={(e) => setMonth(e.target.value)}
          >
            {MONTHS.slice(0, new Date().getMonth()).map((y, i) => (
              <option key={i} value={i}>
                {y}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table
                limit={10}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                api={{
                  url: `/salary/get/salaries`,
                  body: {
                    company: selectedCompany.value,
                  },
                }}
                placeholder={"User Name"}
                filter={{
                  department: [
                    { label: "Sales ", value: "sales" },
                    { label: "Dispatch", value: "dispatch" },
                  ],
                }}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Salaries;

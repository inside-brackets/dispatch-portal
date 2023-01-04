import React, { useState, useEffect } from "react";
import { Button, Col, Row, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Table from "../../components/table/SmartTable";

const TODAY = new Date();
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

const getYears = () => {
  const YEAR = new Date();
  if (YEAR.getMonth() === 0) {
    YEAR.setFullYear(YEAR.getFullYear() - 1);
  }
  const STARTING_YEAR = 2022;
  const years = Array.from(
    new Array(YEAR.getFullYear() - STARTING_YEAR + 1),
    (val, index) => index + STARTING_YEAR
  );
  return years;
};

const Salaries = () => {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [months, setMonths] = useState([]);
  const [refresh, setRefresh] = useState(null);

  const history = useHistory();
  const { company: selectedCompany } = useSelector((state) => state.user);

  useEffect(() => {
    if (TODAY.getMonth() === 0) {
      setYear(TODAY.getFullYear() - 1);
      setMonth(11);
    } else {
      setYear(TODAY.getFullYear());
      setMonth(TODAY.getMonth() - 1);
    }
  }, []);

  useEffect(() => {
    setRefresh(Math.random());
  }, [year, month]);

  useEffect(() => {
    generateArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const generateArray = async () => {
    if (year < TODAY.getFullYear()) {
      setMonths(MONTHS);
    } else {
      setMonths(MONTHS.slice(0, TODAY.getMonth()));
    }

    if (month >= TODAY.getMonth() && TODAY.getMonth() !== 0) {
      setMonth(TODAY.getMonth() - 1);
    }
  };

  const generateSalary = (id) => {
    history.push("/salary/" + year + "/" + month + "/" + id);
  };

  const customerTableHead = [
    "#",
    "User Name",
    "Phone",
    "Email",
    "Designation",
    "Department",
    "Salary",
    "Paid",
    "",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.userName}</td>
      <td>{item.phoneNo ? item.phoneNo : "N/A"}</td>
      <td>{item.email ? item.email : "N/A"}</td>
      <td>{item.designation}</td>
      <td>{item.department}</td>
      <td>{item.salary}</td>
      <td>{item.paid ? "Yes" : "No"}</td>
      <td>
        <Button
          type="view"
          variant={item.paid ? "success" : "primary"}
          style={{ minWidth: "5.125rem", width: "100%" }}
          onClick={() => generateSalary(item._id)}
        >
          {item.paid ? "View" : "Generate"}
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
            {months.map((y, i) => (
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
              {year && month && (
                <Table
                  limit={10}
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  api={{
                    url: `/salary/get/salaries/${year}/${month}`,
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
                  refresh={refresh}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Salaries;

import React, { useState, useEffect } from "react";
import { Button, Col, Row, Card } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Table from "../../components/table/SmartTable";

const Salaries = () => {
  const [users, setUsers] = useState("");
  const [refresh, setRefresh] = useState(false);

  const history = useHistory();

  const { company: selectedCompany } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/salary/get/salaries`,
        {
          company: selectedCompany.value,
        }
      );
      setUsers(data);
    };
    fetchUsers();
  }, [refresh, selectedCompany]);

  const generateSalary = (id) => {
    history.push("/salary/" + id);
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
    <Row>
      <Col>
        <Card>
          <Card.Body>
            <Table
              limit={10}
              headData={customerTableHead}
              renderHead={(item, index) => renderHead(item, index)}
              api={{
                url: `${process.env.REACT_APP_BACKEND_URL}/salary/get/salaries`,
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
  );
};

export default Salaries;

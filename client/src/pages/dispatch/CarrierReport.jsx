import axios from "axios";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Table from "../../components/table/SmartTable";
import EditButton from "../../components/UI/EditButton";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const Users = () => {
  const [rerenderTable, setRerenderTable] = useState(null);
  const { user } = useSelector((state) => state.user);
  const history = useHistory();

  const customerTableHead = ["#", "MC", "Truck", "From", "To", "Actions"];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const handleDelete = async (id) => {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/dispatch/delete-carrier-report/${id}`
    );
    setRerenderTable(Math.random());
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.carrier.mc_number}</td>
      <td>{item.truck ? item.truck : "N/A"}</td>
      <td>{moment(item.from).format("ll")}</td>
      <td>{moment(item.to).format("ll")}</td>
      <td>
        <div className="edit__class">
          <EditButton
            type="open"
            onClick={() => history.push(`/generate-report/${item._id}`)}
          />
          <EditButton type="delete" onClick={() => handleDelete(item._id)} />
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Row className="m-3">
        <Col md={3}></Col>
        <Col md={5}></Col>
        <Col md={4}>
          <Button
            onClick={(e) => history.push("generate-report")}
            style={{ float: "right" }}
          >
            Generate
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="card">
            <div className="card__body">
              <Table
                key={rerenderTable}
                limit={10}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                api={{
                  url: `${process.env.REACT_APP_BACKEND_URL}/dispatch/getcarrierreport`,
                  body: { dispatcher: user._id },
                }}
                filter={{}}
                renderBody={(item, index, currPage) =>
                  renderBody(item, index, currPage)
                }
              />
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Users;

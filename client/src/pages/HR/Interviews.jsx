import { Button, Col, Row } from "react-bootstrap";
import Table from "../../components/table/SmartTable";
import EditButton from "../../components/UI/EditButton";
import moment from "moment";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import status_map from "../../assets/JsonData/status_map.json";
import Badge from "../../components/badge/Badge";

const Interviews = () => {
  const history = useHistory();
  const { company: selectedCompany } = useSelector((state) => state.user);

  const customerTableHead = [
    "#",
    "Candidate",
    "Interviewer",
    "Time",
    "Department",
    "Status",
    "Actions",
    "",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.candidate.first_name + " " + item.candidate.last_name}</td>
      <td>{item.interviewer ? item.interviewer.user_name : "N/A"}</td>
      <td>{moment(item.time).format("DD MMMM hh:mm A")}</td>
      <td>{item.candidate ? item.candidate.department : "N/A"}</td>
      <td>
        <Badge type={status_map[item.status]} content={item.status} />
      </td>
      <td>
        <div className="edit__class">
          <EditButton
            type={
              item.status === "hired" || item.status === "rejected"
                ? "eye"
                : "open"
            }
            onClick={() => history.push(`/interviews/create/${item._id}`)}
          />
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
            onClick={() => history.push("/interviews/create")}
            style={{ float: "right" }}
          >
            Schedule Interview
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="card">
            <div className="card__body">
              <Table
                limit={10}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                api={{
                  url: `${process.env.REACT_APP_BACKEND_URL}/interviews/get-table-interviews`,
                  body: {
                    company: selectedCompany.value,
                  },
                }}
                placeholder={"Candidate Name | Interviewer"}
                status_placeholder={"Designation:"}
                filter={{
                  department: [
                    { label: "sales ", value: "sales" },
                    { label: "dispatch", value: "dispatch" },
                    { label: "Admin", value: "admin" },
                    { label: "HR", value: "HR" },
                    { label: "Accounts", value: "accounts" },
                  ],
                  status: [
                    { label: "Scheduled", value: "scheduled" },
                    { label: "Hired", value: "hired" },
                    { label: "Rejected", value: "rejected" },
                    { label: "Pending Decision", value: "pending-decision" },
                  ],
                }}
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

export default Interviews;
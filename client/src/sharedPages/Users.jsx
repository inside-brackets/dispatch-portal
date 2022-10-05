import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Table from "../components/table/SmartTable";
import EditButton from "../components/UI/EditButton";
import MyModal from "../components/modals/MyModal";
import NewUserForm from "../components/Form/NewUserForm";
import moment from "moment";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import status_map from "../assets/JsonData/status_map.json";
import Badge from "../components/badge/Badge";
import user_image from "../assets/images/taut.png";

const Users = () => {
  const [users, setUsers] = useState("");
  const [refresh, setRefresh] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);

  const history = useHistory();
  const { company: selectedCompany } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/getusers`,
        {
          company: selectedCompany.value,
        }
      );
      setUsers(data);
    };
    fetchUsers();
  }, [refresh, selectedCompany]);

  const customerTableHead = [
    "#",
    "User",
    "Phone #",
    "Email",
    "Designation",
    "Department",
    "Joining Date",
    "Basic Salary",
    "User Status",
    "Actions",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const closeCloseModel = () => {
    setShowModal(false);
  };
  const addUserHandler = () => {
    setShowModal(true);
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        <Row>
          <Col md={3} className="p-0">
            <div className="container p-0">
              <div className="circle mt-0">
                <img src={item.profile_image ?? user_image} alt="." />
              </div>
            </div>
          </Col>
          <Col md={9}>
            <Row>
              <Col>{`${item.user_name}`} </Col>
            </Row>
            <Row>
              <Col>
                {`${
                  item.first_name
                    ? `${item.first_name} ${item.last_name}`
                    : "Not Added"
                } `}
              </Col>
            </Row>
          </Col>
        </Row>
      </td>
      <td>{item.phone_number ? item.phone_number : "N/A"}</td>
      <td>{item.email_address ? item.email_address : "N/A"}</td>
      <td>{item.designation}</td>
      <td>{item.department}</td>
      <td>{moment(item.joining_date).format("ll")}</td>
      <td>{item.salary}</td>
      <td>
        <Badge type={status_map[item.u_status]} content={item.u_status} />
      </td>
      <td>
        <div className="edit__class">
          <EditButton
            type="open"
            onClick={() => history.push(`/users/${item._id}`)}
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
          <Button onClick={addUserHandler} style={{ float: "right" }}>
            Add User
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
                  url: `${process.env.REACT_APP_BACKEND_URL}/get-table-users`,
                  body: {
                    company: selectedCompany.value,
                  },
                }}
                placeholder={"User Name | Full name"}
                status_placeholder={"Designation:"}
                filter={{
                  department: [
                    { label: "sales ", value: "sales" },
                    { label: "dispatch", value: "dispatch" },
                    { label: "HR", value: "HR" },
                  ],
                  status: [
                    { label: "Fired ", value: "fired" },
                    { label: "Inactive", value: "inactive" },
                    { label: "Active", value: "active" },
                  ],
                }}
                renderBody={(item, index, currPage) =>
                  renderBody(item, index, currPage)
                }
              />
            </div>
          </div>
        </Col>
        <MyModal
          size="lg"
          show={showModal}
          heading="ADD User"
          onClose={closeCloseModel}
          style={{ width: "auto" }}
        >
          <NewUserForm
            setShowModal={(data) => {
              setShowModal(data);
              setRerenderTable(Math.random());
            }}
            data={users}
            setRefresh={setRefresh}
          />
        </MyModal>
      </Row>
    </>
  );
};

export default Users;

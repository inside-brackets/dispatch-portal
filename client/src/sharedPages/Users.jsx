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
import Select from "react-select";
import TooltipCustom from "../components/tooltip/TooltipCustom";

const Users = () => {
  const [users, setUsers] = useState("");
  const [refresh, setRefresh] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);
  const [filter, setFilter] = useState({
    label: "All",
    value: null,
  });
  const history = useHistory();
  const { company: selectedCompany } = useSelector((state) => state.user);
  const departments = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.post(`/getusers`, {
        company: selectedCompany.value,
      });
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

  const renderBody = (item, index) => {
    return (
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
        <td>
          <Badge type={status_map[item.u_status]} content={item.u_status} />
        </td>
        <td key={index} style={{ position: "relative" }}>
          <div className="edit__classUser" data-tip data-for="registerTipUser">
            <EditButton
              type="open"
              onClick={() => history.push(`/users/${item._id}`)}
            />
          </div>
          <TooltipCustom
            text="View Detail Page"
            id="registerTipUser"
          ></TooltipCustom>
        </td>
      </tr>
    );
  };
  return (
    <>
      <h2>Users</h2>
      <Row className="my-3 mx-1">
        <Col md={3} className="p-0">
          <Select
            label="Users"
            value={filter}
            onChange={(e) => {
              setRerenderTable(Math.random());
              setFilter(e);
            }}
            options={[
              {
                label: "All",
                value: null,
              },
              {
                label: "Joining Soon",
                value: `upcoming`,
              },
              {
                label: "Joined This Month",
                value: "this_month",
              },
            ]}
          />
        </Col>
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
                  url: `/get-table-users`,
                  body: {
                    company: selectedCompany.value,
                    department: departments.user.department,
                    joining_date: filter?.value,
                  },
                }}
                placeholder={"User Name | Full name"}
                status_placeholder={"Designation:"}
                filter={{
                  department: [
                    { label: "sales", value: "sales" },
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

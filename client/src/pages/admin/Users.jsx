import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Table from "../../components/table/Table";
import EditButton from "../../components/UI/EditButton";
import MyModal from "../../components/modals/MyModal";
import NewUserForm from "../../components/Form/NewUserForm";
import MySelect from "../../components/UI/MySelect";
import Input from "../../components/UI/MyInput";

const Users = () => {
  const [users, setUsers] = useState("");
  const [refresh, setRefresh] = useState(null);
  const [user, setUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const searchRef = useRef();
  const [searchedCarrier, setSearchedCarrier] = useState([]);
  const search = (e) => {
    console.log("ref", searchRef);
    if (e.key === "Enter") {
      const searched = users.filter((user) => {
        return user.user_name
          .toLowerCase()
          .includes(searchRef.current.value.toLowerCase());
      });
      console.log("searched", searched);

      if (searched) {
        setSearchedCarrier(searched);
      } else {
        setSearchedCarrier([]);
      }
    }
  };
  // filter
  const [filteredCarrier, setFilteredCarrier] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState([]);

  const searchByFilter = (values) => {
    setSelectedFilter(values);
    if (values.length !== 0) {
      const filters = values.map((item) => item.value);
      setFilteredCarrier(
        users.filter((item) => filters.includes(item.department))
      );
    } else {
      setFilteredCarrier(null);
    }
  };

  useEffect(() => {
    console.log("useeffect");
    const fetchUsers = async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/getusers`,
        {}
      );
      setUsers(data);
    };
    fetchUsers();
  }, [refresh]);

  const customerTableHead = [
    "#",
    "User Name",
    "Phone #",
    "Email",
    "Designation",
    "Department",
    "Joining Date",
    "Basic Salary",
    // "Edit/Del",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const closeCloseModel = () => {
    setShowModal(false);
  };
  const closeEditModel = () => {
    setEditModal(false);
  };

  const deleteUserHandler = async (id) => {
    var result = window.confirm("Want to delete");

    if (result) {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/admin/deleteuser`,
        { data: { id } }
      );
    }
  };
  const editModalHnadler = (item) => {
    setEditModal(true);
    console.log(item);
    setUser(item);
  };
  const addUserHandler = () => {
    setShowModal(true);
    console.log("button click");
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.user_name}</td>
      <td>{item.phone_number}</td>
      <td>{item.email_address}</td>
      <td>{item.designation}</td>
      <td>{item.department}</td>
      <td>{item.joining_date}</td>
      <td>{item.salary}</td>
      <td>
        <div className="edit__class">
          <EditButton type="edit" onClick={() => editModalHnadler(item)} />

          <EditButton
            type="delete"
            onClick={() => {
              deleteUserHandler(item._id);
            }}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Row className="m-3">
        <Col md={3}>
          <Input
            type="text"
            placeholder="Search user"
            icon="bx bx-search"
            ref={searchRef}
            // onChange={search}
            onKeyDown={search}
            // ref={Driver1NameRef}
          />
        </Col>
        <Col md={5}>
          <MySelect
            isMulti={true}
            value={selectedFilter}
            onChange={searchByFilter}
            // icon="bx bx-filter-alt"
            options={[
              { label: "sales ", value: "sales" },
              { label: "dispatch ", value: "dispatch" },
              { label: "HR", value: "HR" },
              { label: "admin", value: "admin" },
              { label: "accounts", value: "accounts" },
            ]}
          />
        </Col>
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
              {searchedCarrier.length !== 0 && !filteredCarrier && (
                <Table
                  key={Math.random()}
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={searchedCarrier}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
              {searchedCarrier.length === 0 && filteredCarrier && (
                <Table
                  key={filteredCarrier.length}
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={filteredCarrier}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
              {searchedCarrier.length === 0 && !filteredCarrier && (
                <Table
                  limit="10"
                  key={Math.random()}
                  headData={customerTableHead}
                  overflowHidden
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={users}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
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
            setShowModal={setShowModal}
            data={users}
            setRefresh={setRefresh}
          />
        </MyModal>
        <MyModal
          size="lg"
          show={editModal}
          heading="Edit User"
          onClose={closeEditModel}
          style={{ width: "auto" }}
        >
          <NewUserForm
            setEditModal={setEditModal}
            data={users}
            defaultValue={user}
            setRefresh={setRefresh}
          />
        </MyModal>
      </Row>
    </>
  );
};

export default Users;

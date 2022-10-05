import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Card } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams, useHistory } from "react-router-dom";

import MyModal from "../../components/modals/MyModal";
import NewUserForm from "../../components/Form/NewUserForm";
import DeleteConfirmation from "../../components/modals/DeleteConfirmation";

const InterviewDetail = ({ defaultValue }) => {
  const { company: selectedCompany } = useSelector((state) => state.user);
  const params = useParams();
  const [state, setState] = useState({
    candidate: { company: selectedCompany.value },
  });
  const history = useHistory();
  const [users, setUsers] = useState([]);
  console.log("params", params);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedInterviewer, setSelectedInterviewer] = useState([]);
  const [editale, setEditale] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [handleRejectionModal, setHandleRejectionModal] = useState(false);

  useEffect(() => {
    if (state.candidate.department) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/get-table-users/?search=`, {
          company: selectedCompany.value,
          skip: 0,
          limit: 100,
          filter: {
            department: [
              {
                label: state.candidate.department,
                value: state.candidate.department,
              },
              { label: "HR", value: "HR" },
              { label: "admin", value: "admin" },
            ],
            status: [],
          },
          start: null,
          end: null,
        })
        .then((res) => setUsers(res.data.data))
        .catch((err) => toast.error(err.message));
    }
  }, [state.candidate.department, selectedCompany.value]);

  useEffect(() => {
    if (params.id) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/interviews/${params.id}`)
        .then((res) => {
          setState({
            ...res.data,
            time: res.data.time.substr(0, res.data.time.lastIndexOf(":")),
          });
          setSelectedInterviewer({
            label: res.data.interviewer.user_name,
            value: res.data.interviewer._id,
          });
        });
    } else {
      setEditale(true);
    }
  }, [params.id]);

  let candidate;
  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    if (name === "candidate.department") setSelectedInterviewer([]);

    if (name.split(".")[0] === "candidate") {
      candidate = { ...state.candidate, [name.split(".")[1]]: value };
      setState({
        ...state,
        candidate,
      });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    } else if (selectedInterviewer.length === 0) {
      return toast.error("Please Select Interviewer");
    }
    setLoading(true);
    state.interviewer = selectedInterviewer.value;
    if (!params.id) {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/interviews`,
        state
      );
      history.push("/interviews");
    } else {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/interviews/${params.id}`,
        state
      );
      setEditale(false);
    }
    setLoading(false);
    toast.success("Interview Schedule Successfully");
  };
  console.log("state", state);

  const handleRejection = async () => {
    setLoading(true);
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/interviews/${params.id}`, {
        status: "rejected",
      })
      .then((res) => toast.success("Rejected Sucessfully"));

    setLoading(false);
    history.push("/interviews");
  };
  const handleHire = async () => {
    setLoading(true);
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/interviews/${params.id}`, {
        status: "hired",
      })
      .then((res) => toast.success("Hired Sucessfully"))
      .catch((err) => toast.error(err.message));

    setLoading(false);
    setEditModal(false);
    history.push("/interviews");
  };

  return (
    <Card>
      <h2 className="text-center my-2">Interview Detail</h2>
      <hr />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h3 className="my-2">Candidate</h3>
        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              placeholder="First Name"
              name="candidate.first_name"
              value={state.candidate.first_name ?? ""}
              onChange={handleChange}
              readOnly={!editale}
              type="text"
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              placeholder="Last Name"
              name="candidate.last_name"
              value={state.candidate.last_name ?? ""}
              onChange={handleChange}
              readOnly={!editale}
              type="text"
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              placeholder="Phone Number"
              name="candidate.phone_number"
              value={state.candidate.phone_number ?? ""}
              onChange={handleChange}
              type="text"
              readOnly={!editale}
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Address</Form.Label>
            <Form.Control
              placeholder="Address"
              name="candidate.address"
              value={state.candidate.address ?? ""}
              onChange={handleChange}
              readOnly={!editale}
              type="text"
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Department</Form.Label>
            <Form.Control
              as="select"
              name="candidate.department"
              required
              disabled={!editale}
              value={state.candidate.department ?? ""}
              placeholder="Select Department"
              onChange={handleChange}
            >
              <option value={null}></option>
              <option value="sales">Sales</option>
              <option value="dispatch">Dispatch</option>
              <option value="HR">HR</option>
              <option value="admin">Admin</option>
              <option value="accounts">Accounts</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Company</Form.Label>
            <Form.Control
              placeholder="Company"
              name="candidate.company"
              readOnly
              value={state.candidate.company ?? ""}
              onChange={handleChange}
              // readOnly={!editale}
              type="text"
              required
            />
          </Form.Group>
          <h3 className="my-4">Interviewer</h3>
          <Form.Group as={Col} md="6">
            <Form.Label>Interviewer</Form.Label>
            <Select
              value={selectedInterviewer}
              onChange={setSelectedInterviewer}
              isDisabled={
                users.length === 0 || !state.candidate.department || !editale
              }
              isSearchable={true}
              isRequired
              options={users.map((user) => {
                return { label: user.user_name, value: user._id };
              })}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Date.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Time</Form.Label>
            <Form.Control
              name="time"
              value={state.time ? state.time : ""}
              onChange={handleChange}
              readOnly={!editale}
              type="datetime-local"
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Status</Form.Label>
            <Form.Control
              name="status"
              as="select"
              placeholder="Select Status"
              required
              value={state.status ?? ""}
              onChange={handleChange}
              readOnly={!editale}
            >
              <option value={["hired", "rejected"].includes(state.status)
                  ? state.status
                  : ""}>
                {" "}
                {["hired", "rejected"].includes(state.status)
                  ? state.status
                  : ""}
              </option>
              <option value="scheduled">scheduled</option>
              <option value="pending-decision">pending-decision</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              name="remarks"
              onChange={handleChange}
              readOnly={!editale}
              as="textarea"
              value={state.remarks ?? ""}
              aria-label="With textarea"
            />
          </Form.Group>
        </Row>
        <Row className="my-5">
          {!params.id ? (
            <Col md={2}>
              <Button className="w-100 p-2" disabled={loading} type="submit">
                {loading ? "loading..." : "Submit"}
              </Button>
            </Col>
          ) : (
            editale && (
              <Col md={2}>
                <Button
                  className="w-100 p-2"
                  variant="outline-success"
                  disabled={loading}
                  type="submit"
                >
                  Save
                </Button>
              </Col>
            )
          )}

          {params.id && (
            <Col md={2}>
              <Button
                className="w-100 p-2"
                variant={`outline-${!editale ? "primary" : "danger"}`}
                disabled={
                  loading ||
                  state.status === "hired" ||
                  state.status === "rejected"
                }
                onClick={() => setEditale(!editale)}
              >
                {!editale ? "Edit" : "Close"}
              </Button>
            </Col>
          )}
          <Col></Col>
          {params.id && (
            <>
              {" "}
              <Col className="float-right" md={2}>
                <Button
                  className="w-100 p-2"
                  variant="danger"
                  disabled={
                    loading ||
                    editale ||
                    state.status === "hired" ||
                    state.status === "rejected"
                  }
                  onClick={() => setHandleRejectionModal(true)}
                >
                  Rejected
                </Button>
              </Col>
              <Col md={2}>
                <Button
                  className="w-100 p-2"
                  variant="success"
                  disabled={
                    loading ||
                    editale ||
                    state.status === "hired" ||
                    state.status === "rejected"
                  }
                  onClick={() => setEditModal(true)}
                >
                  Hire
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Form>
      <MyModal
        size="lg"
        show={editModal}
        heading="Add User"
        onClose={() => setEditModal(false)}
        style={{ width: "auto" }}
      >
        <NewUserForm
          // setEditModal={(data) => {
          //   handleHire()}}
          setRefresh={handleHire}
          interview
          defaultValue={state.candidate}
        />
      </MyModal>
      <DeleteConfirmation
        showModal={handleRejectionModal}
        confirmModal={handleRejection}
        hideModal={() => setHandleRejectionModal(false)}
        message={"Are you Sure to want to Reject candidate?"}
        title="Reject Confirmation"
      />
    </Card>
  );
};

export default InterviewDetail;

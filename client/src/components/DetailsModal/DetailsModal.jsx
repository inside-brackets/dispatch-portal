import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

export default function DetailsModal(props) {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [today, setToday] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const modalSwitch = props.mSwitch;

  useEffect(() => {
    removeDuplicates();
  }, [props.users, today]);

  useEffect(() => {
    fetchDetails();
  }, [data]);

  useEffect(() => {
    if (modalSwitch) {
      users.sort((a, b) => b.registered - a.registered);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [users]);

  const removeDuplicates = () => {
    if (modalSwitch) {
      setLoading(true);
      if (props.users[today.getMonth()]) {
        let temp = [];
        for (let i = 0; i < props.users[today.getMonth()].length; i++) {
          temp.push(props.users[today.getMonth()][i].user);
        }
        temp = [...new Set(temp)];
        setData(temp);
        setUsers([]);
      }
    } else {
      fetchStats();
    }
  };

  const fetchDetails = () => {
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/getuser/${data[i]}`)
          .then((res) => {
            const didnotpick = props.users[today.getMonth()].filter(
              (carrier) =>
                carrier.change === "didnotpick" && carrier.user == data[i]
            );
            const rejected = props.users[today.getMonth()].filter(
              (carrier) =>
                carrier.change === "rejected" && carrier.user == data[i]
            );
            const registered = props.users[today.getMonth()].filter(
              (carrier) =>
                carrier.change === "registered" && carrier.user == data[i]
            );
            const appointment = props.users[today.getMonth()].filter(
              (carrier) =>
                carrier.change === "appointment" && carrier.user == data[i]
            );

            setUsers((prevState) => [
              ...prevState,
              {
                user_name: res.data.user_name,
                registered: registered.length ?? 0,
                appointment: appointment.length ?? 0,
                rejected: rejected.length ?? 0,
                didnotpick: didnotpick.length ?? 0,
              },
            ]);
          });
      }
    }
  };

  const fetchStats = () => {
    for (let i = 0; i < props.users.length; i++) {
      if (props.users[i]) {
        const didnotpick = props.users[i].filter(
          (carrier) => carrier.change === "didnotpick"
        );
        const rejected = props.users[i].filter(
          (carrier) => carrier.change === "rejected"
        );
        const registered = props.users[i].filter(
          (carrier) => carrier.change === "registered"
        );
        const appointment = props.users[i].filter(
          (carrier) => carrier.change === "appointment"
        );

        setUsers((prevState) => [
          ...prevState,
          {
            month: months[i],
            registered: registered.length ?? 0,
            appointment: appointment.length ?? 0,
            rejected: rejected.length ?? 0,
            didnotpick: didnotpick.length ?? 0,
          },
        ]);
      } else {
        setUsers((prevState) => [
          ...prevState,
          {
            month: months[i],
            registered: 0,
            appointment: 0,
            rejected: 0,
            didnotpick: 0,
          },
        ]);
      }
    }
  };

  const handleChange = (e) => {
    if (Number(e.target.value) > today.getMonth()) {
      setUsers([]);
    }
    setToday(new Date(today.getFullYear(), Number(e.target.value)));
  };

  const months = [
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

  return (
    <Modal show={props.show} size="lg" centered>
      <Modal.Header>
        {modalSwitch ? (
          <Modal.Title>Top Sales</Modal.Title>
        ) : (
          <Modal.Title>User Stats</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div>Please wait...</div>
        ) : (
          <Table hover>
            <thead>
              {modalSwitch ? (
                <tr>
                  <th className="text-center">Rank</th>
                  <th>User</th>
                  <th className="text-center">Registered</th>
                  <th className="text-center">Appointment</th>
                  <th className="text-center">Rejected</th>
                  <th className="text-center">Total</th>
                </tr>
              ) : (
                <tr>
                  <th className="text-center">No.</th>
                  <th>Month</th>
                  <th className="text-center">Registered</th>
                  <th className="text-center">Appointment</th>
                  <th className="text-center">Rejected</th>
                  <th className="text-center">Total</th>
                </tr>
              )}
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      {modalSwitch ? (
                        <td>{user.user_name}</td>
                      ) : (
                        <td>{months[index]}</td>
                      )}
                      <td className="text-center">{user.registered}</td>
                      <td className="text-center">{user.appointment}</td>
                      <td className="text-center">{user.rejected}</td>
                      <td className="text-center">
                        {user.registered +
                          user.appointment +
                          user.rejected +
                          user.didnotpick}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colspan="6"
                    className="text-center text-danger"
                    style={{ fontSize: "18px", fontWeight: "600" }}
                  >
                    Not enough data to show...
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        {modalSwitch && (
          <div>
            <select
              className="form-select"
              value={today.getMonth()}
              onChange={handleChange}
            >
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>
        )}
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

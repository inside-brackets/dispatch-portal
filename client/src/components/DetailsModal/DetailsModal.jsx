import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

export default function DetailsModal(props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchDetails();
  }, [props.users]);

  const fetchDetails = () => {
    for (let i = 0; i < props.users.length; i++) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/getuser/${props.users[i]}`)
        .then(({ data }) => {
          axios
            .post(
              `${process.env.REACT_APP_BACKEND_URL}/admin/registered-and-rejected`,
              {
                user_id: data._id,
                change: ["rejected", "registered", "appointment"],
              }
            )
            .then((res) => {
              const rejected = res.data.filter(
                (carrier) => carrier.change === "rejected"
              );
              const registered = res.data.filter(
                (carrier) => carrier.change === "registered"
              );
              const appointment = res.data.filter(
                (carrier) => carrier.change === "appointment"
              );

              setUsers((prevState) => [
                ...prevState,
                {
                  user_name: data.user_name,
                  registered: registered.length ?? 0,
                  appointment: appointment.length ?? 0,
                  rejected: rejected.length ?? 0,
                },
              ]);
            });
        });
    }
    console.log(users);
  };

  return (
    <Modal show={props.show} size="lg" centered>
      <Modal.Header>
        <Modal.Title>Top Sales</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table hover>
          <thead>
            <tr>
              <th className="text-center">Rank</th>
              <th>Details</th>
              <th className="text-center">Registered</th>
              <th className="text-center">Appointment</th>
              <th className="text-center">Rejected</th>
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => {
                return (
                  <tr>
                    <td className="text-center">{index + 1}</td>
                    <td>{user.user_name}</td>
                    <td className="text-center">{user.registered}</td>
                    <td className="text-center">{user.appointment}</td>
                    <td className="text-center">{user.rejected}</td>
                    <td className="text-center">0</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <select className="form-select" value="10">
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

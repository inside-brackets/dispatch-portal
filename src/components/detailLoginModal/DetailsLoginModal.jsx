import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

export default function DetailsLoginModal(props) {

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [today, setToday] = useState(new Date());
  const [userleave, setUserleave] = useState([])
  const [loading, setLoading] = useState(false);
  const modalSwitch = props.mSwitch

  useEffect(async()=>{
   await axios.get('/logintime/getlogins').then((res) => {
     console.log(res.data)
    setUsers(res.data.users)
   })
   combineData()
   make_number_of_leaves()
  },[])
  let arr = []
  let combineData=()=>{
  for(let i=1;i<28;i++){
    console.log(users)
    for(let j=0;j<users[i]?.length;j++)
    {
      arr.push(users[i][j]?._id)
    }
    // arr.push(users[i]._id)
  }
  console.log(arr,"arr")
  }
  let make_number_of_leaves =async()=>{
  for(let i=0;i<arr.length;i++)
  await axios.get(`/getuser/${arr[i]}`).then((res) => {
    console.log(res.data,"res.data")
  })
  }
  // console.log(new Date(users[11][1].createdAt).getDate(),"users[11]")
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
                  <th className="text-center">Name</th>
                  <th className="text-center">Department</th>
                  <th className="text-center">Late-Login</th>
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
              // onChange={handleChange}
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

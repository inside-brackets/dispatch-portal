import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

export default function DetailsLoginModal(props) {

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [today, setToday] = useState(new Date());
  const [salesTime,setSalesTime] = useState();
  const [dispatchTime,setDispatchTime] = useState();
  const [userleave, setUserleave] = useState([])
  const [loading, setLoading] = useState(false);
  let sales ,dispatcher
  useEffect(async()=>{
    await axios.get(`/settings/timelogin`).then(({ data }) => {
      data.map((data) =>{
        if(data.loginTime===4){
          data.loginTime = 16
        }else if(data.loginTime===5){
          data.loginTime= 17
        }
        else if(data.loginTime===6){
          data.loginTime= 18
        }
        else if(data.loginTime===7){
          data.loginTime= 19
        }
        else if(data.loginTime===8){
          data.loginTime= 20
        }
        else if(data.loginTime===9){
          data.loginTime= 21
        }
        else if(data.loginTime===10){
          data.loginTime= 22
        }
        if(data.department==="sales"){
          sales = data.loginTime
          setSalesTime(data.loginTime)
        }else if(data.department==="dispatcher"){
          dispatcher=data.loginTime
          setDispatchTime(data.loginTime)
        }
      })
  
    })
    axios.post('/logintime/getlogins',{
      sales:sales,
      dispatcher:dispatcher,
      month:today.getMonth(),
    }).then((res) => {
      // setUsers(res.data)
   })
  },[])

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

  const handleChange = async (e) => {
    if (Number(e.target.value) > today.getMonth()) {
      setUsers([]);
    }
    setToday(new Date(today.getFullYear(), Number(e.target.value)));
    let month = new Date(today.getFullYear(), Number(e.target.value))
    await axios.post('/logintime/getlogins',{
      sales:salesTime,
      dispatcher:dispatchTime,
      month:month.getMonth(),
    }).then((res) => {
      // setUsers(res.data)
   })
  };

  return (
    <Modal show={props.show} size="lg" centered>
      <Modal.Header>
          <Modal.Title>Late Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div>Please wait...</div>
        ) : (
          <Table hover>
            <thead>
                <tr>
                  <th className="text-center">Name</th>
                  <th className="text-center">Department</th>
                  <th className="text-center">Late-Login</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
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
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

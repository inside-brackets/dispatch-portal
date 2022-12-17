import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Loader from "react-loader-spinner";

export default function DetailsLoginModal(props) {

  const [data, setData] = useState([]);
  const [lateUsers, setLateUsers] = useState([]);
  const [today, setToday] = useState(new Date());
  const [salesTime,setSalesTime] = useState();
  const [dispatchTime,setDispatchTime] = useState();
  const [loading, setLoading] = useState(false);
  let sales ,dispatcher
  useEffect(async()=>{
    setLoading(true)
    await axios.get(`/settings/timelogin`).then(({ data }) => {
      data.map((data) =>{
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
      setLateUsers(res.data.sort((a, b) => b.late - a.late))
      setLoading(false);
   })
  },[])

console.log(lateUsers)
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
    setLoading(true)
    if (Number(e.target.value) > today.getMonth()) {
      setLateUsers([]);
      setLoading(false)
    }

    setToday(new Date(today.getFullYear(), Number(e.target.value)));
    let month = new Date(today.getFullYear(), Number(e.target.value))
    await axios.post('/logintime/getlogins',{
      sales:salesTime,
      dispatcher:dispatchTime,
      month:month.getMonth(),
    }).then((res) => {
      setLateUsers(res.data.sort((a, b) => b.late - a.late))
      setLoading(false)
   })
  };

  return (
    <Modal show={props.show} size="lg" centered>
      <Modal.Header>
          <Modal.Title>Late Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div 
          style={{marginLeft:'44%'}}
          >
          <Loader
            type="MutatingDots"
            color="#349eff"
            height={100}
            width={100}
          />
        </div>
        ) : (
          <Table hover>
            <thead>
                <tr>
                  <th className="text-center">No.</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Department</th>
                  <th className="text-center">Late-Login</th>
                </tr>
            </thead>
            <tbody>
          {lateUsers.map((ele,index)=>{
                  return (
                            <tr key={index}>
                            <td className="text-center">{index+1}</td>
                            <td className="text-center">{ele?.user_name[0]}</td>
                            <td className="text-center">{ele?.department[0]}</td>
                            <td className="text-center">{ele?.late}</td>
                          </tr>
                          )
           })}

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

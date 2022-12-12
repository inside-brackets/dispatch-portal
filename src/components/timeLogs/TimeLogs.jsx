import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Button, Col, Row } from "react-bootstrap";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import axios from "axios";
import MySelect from "../UI/MySelect";

import "./timeLogs.css";

const TimeLogs = () => {
  const [saleTime,setSaleTime]=useState()
  const [dispatchTime,setDispatchTime]=useState()
  const [isLoading,setIsLoading]= useState(false)
  const [onChangeMenu,setOnChangeMenu]=useState(true)

  useEffect(async()=>{
    await axios.get(`/settings/timelogin`).then(({ data }) => {
      data.map((time) =>{
        if(time.department==='sales'){
          setSaleTime({label:time.loginTime, value:time.loginTime})
        }else if(time.department==='dispatcher'){
          setDispatchTime({label:time.loginTime,value:time.loginTime})
        }
      })
}

)},[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    let timelogs = [{
      department: "sales",
      loginTime: saleTime?.value
    },
    {
      department: "dispatcher",
      loginTime: dispatchTime?.value
    }
    ]

    await axios({
      method: "POST",
      url: `/settings/update`,
      headers: { "Content-Type": "application/json" },
      data: {
        timelogs: timelogs,
      },
    });
    setIsLoading(false)
    setOnChangeMenu(true)
    toast.success("Login-Time Updated")
  }

  const onMenuChange=()=>{
    setOnChangeMenu(false)
  }
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Card className=" no-pad">
          <Card.Header as="h4" className="text-center crd-header">
            Log-in Time
          </Card.Header>
          <Card.Body>
            <Row>
              <Col></Col>
              <Col className="bold mt-2" md="4"> <span className="depart-label">SalesPerson:</span></Col>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                 {/* <MySelect
                      isMulti={false}
                      value={saleTime}
                      onChange={setSaleTime}
                      options={[
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                        { label: "6", value: "6" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                      ]}
                    /> */}
                  <MySelect
                                        value={saleTime}
                                        onChange={setSaleTime}
                                        onInputChange={onMenuChange}
                                        options={[
                                          { label: "4", value: "4" },
                                          { label: "5", value: "5" },
                                          { label: "6", value: "6" },
                                          { label: "8", value: "8" },
                                          { label: "9", value: "9" },
                                          { label: "10", value: "10" },
                                        ]}
                  />
                <Form.Control.Feedback type="invalid">
                </Form.Control.Feedback>
              </Form.Group>
              <Col md='2' ><span className="time-Text">PM</span></Col>
            </Row>
            <Row>
              <Col></Col>
              <Col className="bold mt-2" md="4"> <span className="depart-label">Dispatcher:</span></Col>
              <Form.Group as={Col} md="5" controlId="validationCustom03">

                                    <MySelect
                      isMulti={false}
                      value={dispatchTime}
                      onChange={setDispatchTime}
                      onInputChange={onMenuChange}
                      options={[
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                        { label: "6", value: "6" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" }
                      ]}
                    />
                <Form.Control.Feedback type="invalid">
                </Form.Control.Feedback>
              </Form.Group>
              <Col md='2'><span className="time-Text">PM</span></Col>
            </Row>
            <Row>
              <Col><div className="btn-timelog"><Button type="submit" disabled={isLoading || onChangeMenu}>Update</Button></div></Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>
    </>
  );
};

export default TimeLogs;

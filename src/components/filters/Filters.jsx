import React, { useState } from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import './filters.css'
import qs from "qs"
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router-dom'
import { encode, decode } from 'js-base64';
import { useEffect } from "react";

const Filters = (props) => {
  const [filter, setFilter] = useState(Object.keys(props.filter).reduce((pre, curr) => ((pre[curr] = []), pre), {}));
  const [reset, setReset] = useState(false)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchIn, setSearchIn] = useState("");
  const location = useLocation()
  let history = useHistory();
  useEffect(() => {
    const url = new URL(window.location.href).searchParams;
    if(url.get("search")){
      let search = url.get("search")
      setSearchIn(search)
    }
    if (url.get("start")) {
          let start = url.get("start")
          setStartDate(start)
        }
    if (url.get("end")) {
              let end = url.get("end")
              setEndDate(end)
            }
    if(url.get("category")){
      let filterValue = url.get("category")?.split(",")
      let filterArr = props.filter?.category
      let originalValue = filterArr?.map((item) => { return item.value })
      const found = originalValue?.filter(word => filterValue.includes(word)).map((item) => { return { label: item, value: item } });
      setFilter((oldValue) => {
              const temp = { ...oldValue };
              temp["category"] = found;
              return temp;
            });
    }

    // console.log(url.)
    // let filterValue


//////////////  Old Code //////////////////////////////////
    // let query = url.search?.slice(1)?.split("&");
    // let queryArr = query.map((item) => { return item.split("=") })

    // for (let i = 0; i < queryArr.length; i++) {
    //   if (queryArr[i][0] === "search") {
    //     let search = queryArr[i][1]
    //     setSearchIn(search)
    //   } else if (queryArr[i][0] === "start") {
    //     let start = queryArr[i][1]
    //     setStartDate(start)
    //   }
    //   else if (queryArr[i][0] === "end") {
    //     let end = queryArr[i][1]
    //     setEndDate(end)
    //   }
    //   else {        
    //     let oriArr = props.filter.category
    //     let originalValue = oriArr?.map((item) => { return item.value }) 
    //     console.log(originalValue,"orginalvalue")
    //     let  filterValue = queryArr[i][1]?.split("%2C").map((item) => { return { label: item, value: item } })
    //     let  filterArray = []
    //     filterArray = queryArr[i][1]?.split("%2C").map((item) => { return item })
    //     console.log(filterArray,"filterArray")

    //     // const found = originalValue.find(element => (filterArray.includes(element)));

    //     const found = originalValue?.filter(word => filterArray.includes(word));
    //     console.log(found,"found")
    //     // console.log(filterArray,"filterArray===>")

    //     // let value = queryArr[i][1]
    //     // let check = filterValue?.map((item)=>{item.value.includes(props.filter?.category.map((item)=>{return item.value}))})
    //     // let check  = filter
    //     // console.log(check,"check====>")
    //     // console.log(filterValue)
    //     setFilter((oldValue) => {
    //       const temp = { ...oldValue };
    //       temp[queryArr[i][0]] = filterValue;
    //       return temp;
    //     });
    //   }
    // }





//////////////  Old Code //////////////////////////////////



  }, [props.filter])

  const filterData = (value, key) => {
    setFilter((oldValue) => {
      const temp = { ...oldValue };
      temp[key] = value;
      return temp;
    });
  };

  const searchData = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (reset) {
      setStartDate(null);
      setEndDate(null);
      e.target.search.value = "";
      e.target.fromDate.value = "";
      e.target.endDate.value = "";
      setFilter(Object.keys(props.filter).reduce((pre, curr) => ((pre[curr] = []), pre), {}))
      history.push({
        pathname: location.pathname,
        search: ""
      })
      setReset(false)
    } else {
      const searchParams = new URLSearchParams();
      let searchObj = {}
      if (props.placeholder && (e.target.search.value.length > 0)) {
        searchObj["search"] = e.target.search.value
      }
      if (props.filter?.status && (filter?.status?.length > 0)) {
        searchObj["status"] = filter.status.map((item) => item.value)
      }
      if (props.filter?.category && (filter?.category?.length > 0)) {
        searchObj["category"] = filter.category.map((item) => item.value)
      }
      if (startDate) {
        searchObj["start"] = startDate
        searchObj["end"] = endDate
      }
      Object.keys(searchObj).forEach(key => searchParams.append(key, searchObj[key]));
      history.push({
        pathname: location.pathname,
        search: `${searchParams.toString()}`
      })
    }
    props.setLocation(window.location.href)
    props.setRerenderTable(Math.random())
  }
  const resetHandler = () => {
    setReset(true)
  }
  return (
    <>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Card >
            <Card.Body>
              <Card.Title>Apply Filters</Card.Title>
              <Row>
                <Col md={3}>
                  <Form.Group controlId="validationCustom03">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      placeholder={props.placeholder}
                      defaultValue={searchIn}
                      onKeyDown={searchData}
                      onChange={event => { setSearchIn(event.target.value) }}
                    />
                  </Form.Group>
                </Col>
                {Object.keys(props.filter).map((key, index) => {
                  if (key === "date_range") {
                    return (
                      <>
                        <Col md={3}>
                          <Form.Group controlId="validationCustom03">
                            <Form.Label>From</Form.Label>
                            <Form.Control
                              name="fromDate"
                              defaultValue={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              type="date"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group controlId="validationCustom03">
                            <Form.Label>To</Form.Label>
                            <Form.Control
                              name="endDate"
                              disabled={!startDate}
                              defaultValue={endDate}
                              onChange={(e) => { setEndDate(e.target.value) }}
                              min={startDate}
                              type="date"
                            />
                          </Form.Group>
                        </Col>
                      </>
                    );
                  }

                  return (
                    <>
                      <Col md={3} className="mb-2">
                        <Form.Label className="text-capitalize">{key}</Form.Label>
                        <Select
                          label={key}
                          isMulti={true}
                          value={filter[key]}
                          onChange={(value) => { filterData(value, key) }}
                          options={props.filter[key]}
                        />
                      </Col>
                    </>);
                })}
              </Row>
              <Row>
                <Col className="filters_btn_wrapper">
                  <Button variant="secondary" size="md" type="submit" onClick={resetHandler} className="m-2">reset</Button>
                  <Button variant="success" size="md" type="submit" className="m-2" >set</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
      </Row>
    </>
  );
};

export default Filters;
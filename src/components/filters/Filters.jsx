import React,{useState} from "react";
import { Form, Card, Row, Col, Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import './filters.css'
import qs from "qs"
import queryString from 'query-string';
import {useHistory,useLocation} from 'react-router-dom'
import { encode, decode } from 'js-base64';

const Filters = (props) => {
    console.log(props.filter,"props.filter")
    const [filter, setFilter] = useState(
        Object.keys(props.filter).reduce((pre, curr) => ((pre[curr] = []), pre), {})
      );
      console.log(filter,"filters")
    const [reset,setReset] = useState(false)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const location = useLocation()
    let history = useHistory();

    let params1 = queryString.parse(location.search)
    
    console.log(params1,"params1==>")
    
 
    console.log(window.location.href,"window.location==>")
    const url = new URL(window.location.href);
    console.log(url.search);                // "?a=~&b=%7E"
    
    // console.log(url.searchParams.get('status').split(','),"get")
    
    ; // "~"
    // console.log(url.searchParams.get('b')); // "~"

    let en = encode({name:"name"})
    console.log(en,"en==>")
let de =decode(en)
console.log(de,"dec==>")

    // const searchParams = new URLSearchParams("key1=value1&key2=value2");
// Create a test URLSearchParams object
// const searchParams = new URLSearchParams("key1=value1&key2=value2");
const searchParams = new URLSearchParams(location.search);
console.log(searchParams.keys(),"searchParams")
// Display the keys
for (const key of searchParams) {
  console.log(key);
}

    // console.log(searchParams,"searchParams==>")
    const filterData = (value, key) => {
        setFilter((oldValue) => {
          const temp = { ...oldValue };
          temp[key] = value;
          return temp;
        });
      };

      const handleSubmit = (e)=>{
          e.preventDefault();
        if(reset){
            console.log("reset Clicked");
            setStartDate(null);
            setEndDate(null);
            e.target.search.value="";
            e.target.fromDate.value="";
            e.target.endDate.value="";
            setFilter(Object.keys(props.filter).reduce((pre, curr) => ((pre[curr] = []), pre), {}))
            history.push({
                pathname: location.pathname,
                search: ""
              })
            setReset(false)

        }else{
            const searchParams = new URLSearchParams();
            let searchObj = {}
            if(props.placeholder){
                searchObj["search"]=e.target.search.value
            }
            if(props.filter.status){
                searchObj["status"]=filter.status.map((item)=>item.value)
            }
            console.log(searchObj,"searchObj====>");
            const search = { search:`${e.target.search.value}`,start:`${startDate}`,end:`${endDate}`,status:["cleared","cancel","okay"],person:["p1","p2","p3"] };
            Object.keys(searchObj).forEach(key => searchParams.append(key, searchObj[key]));

            console.log(searchParams.toString(),"searchParams.toString()");
            // let query = qs.stringify({ search:`${e.target.search.value}`,start:`${startDate}`,end:`${endDate}`,filter:{status:["cleared","cancel","okay"],person:["p1","p2","p3"]} })
            history.push({
                pathname: location.pathname,
                // search: query
                search: `${searchParams.toString()}`
              })
            }
       
      }
      const resetHandler=()=>{
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
                        // type="date"
                        placeholder={props.placeholder}
                        // icon="bx bx-search"
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
                    onChange={(e) => {setEndDate(e.target.value)}}
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
                onChange={(value) => {
                  // setFilter(value);
                  filterData(value, key);
                  // getData();
                }}
                options={props.filter[key]}
              />
            </Col>
            </> );
        })}
</Row>



        
        <Row>
        <Col className="filters_btn_wrapper">
        {/* <input type="reset" value="Reset Form" onClick={(e)=>{e.preventDefault()}}/> */}
        <Button variant="secondary" size="md" type="submit" onClick={resetHandler}  className="m-2">reset</Button>
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
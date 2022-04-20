import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import ReactSelect from "react-select";
import CarrierReport from "../../components/CarrierReport";
import { searchLoads } from "../../utils/utils";

const Report = () => {
  const user = useSelector((state) => state.user.user);
  const [carrier, setCarrier] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [truck, setTruck] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [load, setLoad] = useState();

  const selectionDate = {
    startDate: startDate,
    endDate: endDate,
    key: "Selection",
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getcarriers`, {
        "trucks.dispatcher":user._id,
        c_status: "registered",
      })
      .then((res) => {
        console.log("dispatch carrier", res);
        setCarrier(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSelection = (ranges) => {
    setStartDate(ranges.Selection.startDate);
    setEndDate(ranges.Selection.endDate);
  };

  const handleSubmit = async () => {
  const {data} =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getloads`, {
      "carrier.mc_number": selectedCarrier.value,
      "carrier.truck_number": truck.truck_number,
    });
    setLoad(searchLoads(startDate,endDate,data))
  };
  return (
    <>
      <Row>
        <Col>
          <Card>
            <Row>
              <Col>
                {" "}
                <label>Select MC</label>
                <ReactSelect
                  value={selectedCarrier}
                  onChange={setSelectedCarrier}
                  options={carrier.map((carrier) => ({
                    label: carrier.mc_number,
                    value: carrier.mc_number,
                  }))}
                />
              </Col>
              <Col>
                {" "}
                <label>Select Truck</label>
                <ReactSelect
                  value={truck}
                  onChange={setTruck}
                  options={
                    selectedCarrier &&
                    carrier
                      .find(
                        (carrier) => carrier.mc_number === selectedCarrier.value
                      )
                      .trucks.map((truck) => ({
                        label: truck.truck_number,
                        value: truck.truck_number,
                      }))
                  }
                />
              </Col>
              <Col>
                <DateRangePicker
                  ranges={[selectionDate]}
                  //   minDate={new Date()}
                  showMonthAndYearPickers={false}
                  rangeColors={["#FD5861"]}
                  direction='horizontal'
                  onChange={handleSelection}
                  fixedHeight={false}
                />
              </Col>
              <Col>
                <Button disabled={!selectedCarrier || !truck} onClick={handleSubmit}>Submit</Button>
              </Col>
            </Row>
            <Row>
             {load && <CarrierReport dispatcher={user} load={load} carrier={carrier.find((item)=> item.mc_number === selectedCarrier.value)} truck={truck} />}
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Report;

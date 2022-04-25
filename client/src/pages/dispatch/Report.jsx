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
import { useParams } from "react-router-dom";
import Geocode from "react-geocode";
const Report = () => {
  const params = useParams();
  const user = useSelector((state) => state.user.user);
  const [carrier, setCarrier] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [truck, setTruck] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [load, setLoad] = useState();

  const selectionDate = {
    startDate: startDate,
    endDate: endDate,
    key: "Selection",
  };

  const handleSubmit = async (mc, truck_num) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/getloads`,
      {
        "carrier.mc_number": mc ,
        "carrier.truck_number": truck_num
      }
    );
    console.log("hello abcd", startDate, endDate, data);
    const filteredLoads = searchLoads(startDate, endDate, data);
    // const loads = await Promise.all(filteredLoads.map( async (load) => {
    //   let pick_up_coordinates, drop_coordinates;
    //  await Geocode.fromAddress(load.pick_up.address).then(
    //     (response) => {
    //       pick_up_coordinates = response.results[0].geometry.location;
    //     },
    //     (error) => {
    //       console.error(error);
    //     }
    //   );
    // await  Geocode.fromAddress(load.drop.address).then(
    //     (response) => {
    //       drop_coordinates = response.results[0].geometry.location;
    //     },
    //     (error) => {
    //       console.error(error);
    //     }
    //   );
    //   return {
    //     ...load,
    //     pick_up: {
    //       ...load.pick_up,
    //       lat: pick_up_coordinates.lat,
    //       lng: pick_up_coordinates.lng,
    //     },
    //     drop: {
    //       ...load.pick_up,
    //       lat: drop_coordinates.lat,
    //       lng: drop_coordinates.lng,
    //     },
    //   };
    // }));
    // console.log("findal loads", loads);
    setLoad(filteredLoads);
  };

  useEffect(() => {
    if (params.id) {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/dispatch/get-carrier-report/${params.id}`
        )
        .then((res) => {
          const { data } = res.data;
          console.log("report", data);
          setSelectedCarrier({
            label: data.carrier.mc_number,
            value: data.carrier.mc_number,
          });
          setTruck({ label: data.truck, value: data.truck });
          setStartDate(new Date(data.from));
          setEndDate(new Date(data.to));
          handleSubmit(data.carrier.mc_number, data.truck);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getcarriers`, {
        "trucks.dispatcher": user._id,
        c_status: "registered",
      })
      .then((res) => {
        console.log("dispatch carrier", res);
        setCarrier(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id,user._id]);

  const handleSelection = (ranges) => {
    setStartDate(ranges.Selection.startDate);
    setEndDate(ranges.Selection.endDate);
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
                  options={
                    !params.id &&
                    carrier.map((carrier) => ({
                      label: carrier.mc_number,
                      value: carrier.mc_number,
                    }))
                  }
                />
              </Col>
              <Col>
                {" "}
                <label>Select Truck</label>
                <ReactSelect
                  value={truck}
                  onChange={setTruck}
                  options={
                    !params.id &&
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
                  direction="horizontal"
                  onChange={handleSelection}
                  fixedHeight={false}
                />
              </Col>
              <Col>
                <Button
                  disabled={!selectedCarrier || !truck || !startDate || !endDate}
                  onClick={()=>  handleSubmit(selectedCarrier.value,truck.truck_number)}
                >
                  Submit
                </Button>
              </Col>
            </Row>
            <Row>
              {load && (
                <CarrierReport
                  dispatcher={user}
                  load={load}
                  startDate={startDate}
                  endDate={endDate}
                  carrier={carrier.find(
                    (item) => item.mc_number === selectedCarrier.value
                  )}
                  truck={truck}
                />
              )}
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Report;

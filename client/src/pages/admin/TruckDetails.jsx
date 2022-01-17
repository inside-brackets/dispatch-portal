import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Select from "react-select";
import Loader from "react-loader-spinner";
import BackButton from "../../components/UI/BackButton";
// import Modal from "../../components/modals/MyModal";
import axios from "axios";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const TruckDetails = () => {
  const transformToSelectValue = (value) => {
    if (value.constructor === Array) {
      return value.map((item) => ({
        label: `${item.charAt(0).toUpperCase() + item.slice(1)} `,
        value: item.trim(),
      }));
    } else {
      return {
        label: `${value.charAt(0).toUpperCase() + value.slice(1)} `,
        value: value.trim(),
      };
    }
  };
  //   const [selectedPayment, setSelectedPayment] = useState("");
  const history = useHistory();
  const params = useParams();
  const [carrier, setCarrier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState("");
  const [loadButton, setLoadButton] = useState(false);
  const [trailerType, setTrailerType] = useState("");
  //   const [rmodal, setrModal] = useState();
  const [error, setError] = useState(false);
  const [truck, setTruck] = useState(null);
  const [offDays, setoffDays] = useState("");
  const [validated, setValidated] = useState(false);
  const [selectedDispatcher, setSelectedDispatcher] = useState(null);
  const [dispatchers, setDispatchers] = useState([]);
  const { company } = useSelector((state) => state.user);
  const reassign = async () => {
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/updatetruck/${params.mc}/${params.truck}`,
        { "trucks.$.dispatcher": selectedDispatcher.value }
      )
      .then((result) => {
        console.log("reassing", result.data.trucks);
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      setLoadButton(true);
      const truckObj = {
        "trucks.$.trailer_type": trailerType.value,
        "trucks.$.carry_limit": event.target.carry_limit.value,
        "trucks.$.trip_durration": event.target.trip_durration.value,
        "trucks.$.temperature_restriction":
          event.target.temperature_restriction.value,
        "trucks.$.vin_number": event.target.vin_number.value,
        "trucks.$.region": region.map((item) => item.value),
        "trucks.$.off_days": offDays.map((item) => item.value),
      };
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/updatetruck/${params.mc}/${params.truck}`,
          truckObj
        )
        .then((res) => {
          console.log(res);
          setLoadButton(false);
        })
        .catch((err) => {
          setLoadButton(false);
          console.log(err);
        });
      console.log(truckObj);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getcarrier`, {
        mc_number: params.mc,
      })
      .then(({ data }) => {
        console.log("carrier", data);
        if (data) {
          setCarrier(data);
          const truck = data.trucks.find((item) => {
            return item.truck_number.toString() === params.truck.toString();
          });
          setTruck(truck);
          setRegion(transformToSelectValue(truck.region));
          setoffDays(transformToSelectValue(truck.off_days));
          setTrailerType(transformToSelectValue(truck.trailer_type));
          if (truck.t_status !== "new") {
            setSelectedDispatcher({
              value: truck.dispatcher._id,
              label: truck.dispatcher.user_name,
            });
          }
          console.log(truck);
        } else {
          setError(true);
        }
        setIsLoading(false);
      });
  }, [params.mc, params.truck]);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/getusers`,

        {
          department: "dispatch",
          company: company.value,
        }
      )
      .then(({ data }) => setDispatchers(data));
  }, [company]);

  if (isLoading && !error) {
    return (
      <div className="spreadsheet__loader">
        <Loader type="TailSpin" color="#A9A9A9" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && error) {
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  }

  return (
    <>
      <BackButton
        onClick={() => history.push(`/carrierview/${carrier.mc_number}`)}
      />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Card
          className="truck-detail-card"
          style={{
            width: "auto",
            height: "auto",
            marginLeft: "60px",
            marginRight: "30px",
          }}
        >
          <Card.Body>
            <h1 className="text-center">{carrier.company_name}</h1>
            <hr />
            <h3>Truck Details:</h3>
            <Row className="m-3">
              <Row>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Truck Number:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Agent's Email"
                    defaultValue={truck ? truck.truck_number : false}
                    readOnly
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Truck Number.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Vin Number:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Truck's Vin number"
                    name="vin_number"
                    defaultValue={truck ? truck.vin_number : false}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Vin Number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Carry Limit:</Form.Label>
                  <Form.Control
                    type="number"
                    name="carry_limit"
                    placeholder="carry limit"
                    defaultValue={truck ? truck.carry_limit : false}
                  />
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Temperature Restrictions:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Temperature Restrictions"
                    name="temperature_restriction"
                    defaultValue={truck ? truck.temperature_restriction : false}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Trip Durration:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Trip duration"
                    name="trip_durration"
                    defaultValue={truck ? truck.trip_durration : false}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Region:</Form.Label>
                  <Select
                    label="Region"
                    isMulti={true}
                    value={region}
                    onChange={setRegion}
                    options={[
                      { label: "Central", value: "central" },
                      { label: "Mountain ", value: "mountain" },
                      { label: "Pacific", value: "pacific" },
                      { label: "Eastern ", value: "eastern" },
                      { label: "Allover ", value: "allover" },
                    ]}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom03">
                  <Form.Label>Trailer Type:</Form.Label>
                  <Select
                    label="Trailer Type"
                    isMulti={false}
                    value={trailerType}
                    onChange={setTrailerType}
                    options={[
                      { label: "Dryvan", value: "dryvan" },
                      { label: "Flatbed ", value: "flatbed" },
                      { label: "Reefer ", value: "reefer" },
                      { label: "Gooseneck ", value: "gooseneck" },
                      { label: "Stepdeck ", value: "stepdeck" },
                      { label: "Lowboy ", value: "lowboy" },
                      { label: "Power Only ", value: "power_only" },
                    ]}
                  />
                </Form.Group>
              </Row>
              <Form.Group as={Col} md="4" controlId="validationCustom03">
                <Form.Label>Off Days:</Form.Label>
                <Select
                  isMulti={true}
                  value={offDays}
                  onChange={setoffDays}
                  options={[
                    { label: "Monday", value: "monday" },
                    { label: "Tuesday ", value: "tuesday" },
                    { label: "Wednesday", value: "wednesday" },
                    { label: "Thursday", value: "thursday" },
                    { label: "Friday", value: "friday" },
                    { label: "Saturday", value: "saturday" },
                    { label: "Sunday", value: "sunday" },
                  ]}
                />
              </Form.Group>
              {truck?.t_status !== "new" && (
                <Row className="justify-content-center align-items-center">
                  <Form.Group as={Col} md="4" controlId="validationCustom03">
                    <Form.Label>Dispatcher:</Form.Label>
                    <Select
                      options={dispatchers.map((item) => ({
                        label: item.user_name,
                        value: item._id,
                      }))}
                      value={selectedDispatcher && selectedDispatcher}
                      onChange={setSelectedDispatcher}
                      isSearchable={true}
                    />
                  </Form.Group>
                  <Col>
                    <Button
                      style={{ marginTop: "25px" }}
                      variant="warning"
                      onClick={reassign}
                      disabled={
                        truck?.dispatcher?._id === selectedDispatcher?.value
                      }
                    >
                      Change Dispatcher
                    </Button>
                  </Col>
                </Row>
              )}
            </Row>

            <Button disabled={loadButton} type="submit">
              {" "}
              Submit
            </Button>
          </Card.Body>
        </Card>
      </Form>
    </>
  );
};

export default TruckDetails;

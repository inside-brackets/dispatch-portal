import React, { useState, useEffect } from "react";
import MySelect from "../UI/MySelect";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import "./newTruckForm.css";
import useHttp from "../../hooks/use-https";
import { useParams } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";
import axios from "axios";

const NewTruckForm = ({ defaultValue, closeModal, setTrucks }) => {
  const transformArrayToObjectArray = (array) => {
    return array.map((item) => ({
      label: `${item.charAt(0).toUpperCase() + item.slice(1)} `,
      value: item.trim(),
    }));
  };
  const params = useParams();
  const [driverType, setDriverType] = useState("");
  const [validated, setValidated] = useState("");
  const [selectedTravel, setSelectedTravel] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState([]);
  const [selectedOffDays, setSelectedOffDays] = useState(
    defaultValue ? transformArrayToObjectArray(defaultValue.off_days) : []
  );
  const [buttonLoader, setButtonLoader] = useState(false);
  const [truckNumberIsAvailable, setTruckNumberIsAvailable] = useState(true);
  const { sendRequest: postTruck } = useHttp();
  useEffect(() => {
    if (defaultValue) {
      setSelectedOffDays(transformArrayToObjectArray(defaultValue.off_days));
      setSelectedTrailer(
        transformArrayToObjectArray([defaultValue.trailer_type])[0]
      );
      defaultValue.drivers.length > 1 && setDriverType("teamDriver");
      setSelectedTravel(transformArrayToObjectArray(defaultValue.region));
    }
  }, [defaultValue]);

  const handleDriverChange = (event) => {
    setDriverType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setButtonLoader(true);
      const newTruck = saveTruck(event.target);
      const transformData = (data) => {
        setTrucks(data.trucks);
        closeModal();
      };
      postTruck(
        {
          url: `/addnewtruck/${params.mc}`,
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: newTruck,
        },
        transformData
      );
    }
    setValidated(true);
    setButtonLoader(false);
  };

  const saveTruck = (target) => {
    var drivers = [];
    if (driverType === "teamDriver") {
      drivers = [
        {
          name: target.driver1_name.value,
          email_address: target.driver1_email.value,
          phone_number: target.driver1_phone.value,
        },
        {
          name: target.driver2_name.value,
          email_address: target.driver2_email.value,
          phone_number: target.driver2_phone.value,
        },
      ];
    } else {
      drivers = [
        {
          name: target.driver1_name.value,
          email_address: target.driver1_email.value,
          phone_number: target.driver1_phone.value,
        },
      ];
    }

    const saveObj = {
      truck_number: target.truck_number.value,
      vin_number: target.vin_number.value,
      trailer_type: selectedTrailer.value,
      carry_limit: parseInt(target.carry_limit.value),
      drivers: drivers,
      region: selectedTravel.map((item) => item.value),
      temperature_restriction: parseInt(target.temp_restriction.value),
      trip_duration: parseInt(target.trip_duration.value),
      off_days: selectedOffDays.map((item) => item.value),
    };
    return saveObj;
  };

  const truckNumberChangeHandler = (e) => {
    setTruckNumberIsAvailable(true);

    const indentifier = setTimeout(async () => {
      if (e.target.value) {
        const response = await axios.post(`/getcarrier`, {
          mc_number: params.mc,
          "trucks.truck_number": e.target.value,
        });
        setTruckNumberIsAvailable(response.data.length === 0);
      }
    }, 250);
    return () => {
      clearTimeout(indentifier);
    };
  };
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mt-2">
        <Form.Group as={Col} controlId="validationCustom01">
          <Form.Label>*Truck Number:</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Enter 3 digit code.."
            className={`${
              truckNumberIsAvailable === false && !defaultValue
                ? "invalid is-invalid"
                : ""
            } no__feedback shadow-none`}
            name="truck_number"
            disabled={defaultValue}
            onChange={truckNumberChangeHandler}
            defaultValue={defaultValue ? defaultValue.truck_number : ""}
          />
          {truckNumberIsAvailable && !defaultValue && (
            <Form.Text style={{ color: "green" }}>
              Truck number is available!
            </Form.Text>
          )}
          {truckNumberIsAvailable === false && !defaultValue && (
            <Form.Text style={{ color: "red" }}>
              Whoops! truck number already exists.
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group as={Col} controlId="validationCustom01">
          <Form.Label>*Vin Number:</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Enter code.."
            name="vin_number"
            defaultValue={defaultValue ? defaultValue.vin_number : ""}
          />
        </Form.Group>
      </Row>
      <Row className="mt-2">
        <Form.Group as={Col} controlId="validationCustom01">
          <Form.Label>Carry limit(lbs):</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Maximum carry limit.."
            defaultValue={defaultValue ? defaultValue.carry_limit : ""}
            name="carry_limit"
          />
        </Form.Group>
        <Form.Group as={Col} controlId="validationCustom01">
          <Form.Label>Tempurature Restrictions(F):</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter minimum temp limit.."
            defaultValue={
              defaultValue ? defaultValue.temperature_restriction : ""
            }
            name="temp_restriction"
          />
        </Form.Group>
      </Row>
      <Row className="mt-2">
        <Form.Group as={Col} controlId="validationCustom01">
          <Form.Label>Trip Duarration(days):</Form.Label>
          <Form.Control
            type="number"
            placeholder="no. of days.."
            defaultValue={defaultValue ? defaultValue.trip_duration : ""}
            name="trip_duration"
          />
        </Form.Group>
        <Col>
          <MySelect
            isMulti={true}
            value={selectedTravel}
            onChange={setSelectedTravel}
            label="Travel region:"
            defaultValue={defaultValue ? defaultValue.trip_durration : ""}
            options={[
              { label: "Eastern ", value: "eastern" },
              { label: "Mountain ", value: "mountain" },
              { label: "Central ", value: "central" },
              { label: "Pacific ", value: "pacific" },
              { label: "Allover ", value: "allover" },
            ]}
          />
        </Col>
      </Row>
      <Row className="align-items-center mt-2 py-2">
        <Col>
          <MySelect
            isMulti={true}
            value={selectedOffDays}
            onChange={setSelectedOffDays}
            label="Off Days:"
            options={[
              { label: "Monday ", value: "monday" },
              { label: "Tuesday ", value: "tuesday" },
              { label: "Wednesday ", value: "wednesday" },
              { label: "Thursday ", value: "thursday" },
              { label: "Friday ", value: "friday" },
              { label: "Saturday ", value: "saturday" },
              { label: "Sunday ", value: "sunday" },
            ]}
          />
        </Col>
        <Col>
          <MySelect
            isMulti={false}
            value={selectedTrailer}
            onChange={setSelectedTrailer}
            label="Trailer Type:"
            options={[
              { label: "Dryvan ", value: "dryvan" },
              { label: "Flatbed ", value: "flatbed" },
              { label: "Reefer ", value: "reefer" },
              { label: "Gooseneck ", value: "gooseneck" },
              { label: "Steodeck ", value: "steodeck" },
              { label: "Lowboy ", value: "lowboy" },
              { label: "Power Only ", value: "poweronly" },
              { label: "Box Truck", value: "boxtruck" },
            ]}
          />
        </Col>
      </Row>

      <FormControl component="fieldset">
        <FormLabel style={{ color: "var(--text-color)" }} component="legend">
          *Driver set:
        </FormLabel>
        <RadioGroup
          aria-label="driver"
          name="Driver Set:"
          defaultValue={
            defaultValue
              ? defaultValue.drivers.length === 1
                ? "singledriver"
                : "teamDriver"
              : "singledriver"
          }
          onChange={handleDriverChange}
        >
          <span>
            <FormControlLabel
              value="teamDriver"
              control={<Radio />}
              label="Team Driver"
            />
            <FormControlLabel
              value="singledriver"
              control={<Radio />}
              label="Single Driver"
            />
          </span>
        </RadioGroup>
      </FormControl>
      <Row className="align-items-center mt-2 py-2">
        <Form.Group as={Col} controlId="validationCustom01">
          <Form.Label>Driver 1:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Diver Name"
            defaultValue={defaultValue ? defaultValue.drivers[0]?.name : ""}
            name="driver1_name"
          />
        </Form.Group>
        <Form.Group as={Col} controlId="validationCustom01">
          <Form.Label>Driver Email</Form.Label>
          <Form.Control
            pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$"
            type="text"
            placeholder="Driver Email"
            name="driver1_email"
            defaultValue={
              defaultValue ? defaultValue.drivers[0]?.email_address : ""
            }
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="validationCustom01">
          <Form.Label>Driver Phone Number</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Driver Phone Number"
            name="driver1_phone"
            defaultValue={
              defaultValue ? defaultValue.drivers[0]?.phone_number : ""
            }
          />
        </Form.Group>
      </Row>
      {driverType === "teamDriver" && (
        <>
          <Row className="align-items-center">
            <Form.Group as={Col} controlId="validationCustom01">
              <Form.Label>Driver 2:</Form.Label>
              <Form.Control
                required={driverType === "teamDriver"}
                type="text"
                placeholder="Driver Name"
                defaultValue={defaultValue ? defaultValue.drivers[1]?.name : ""}
                name="driver2_name"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="validationCustom01">
              <Form.Label>Driver Email</Form.Label>
              <Form.Control
                pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$"
                type="email"
                placeholder="Driver Email"
                name="driver2_email"
                defaultValue={
                  defaultValue ? defaultValue.drivers[1]?.email_address : ""
                }
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} controlId="validationCustom01">
              <Form.Label>Driver Phone Number</Form.Label>
              <Form.Control
                required={driverType === "teamDriver"}
                type="number"
                placeholder="Driver Phone Number"
                name="driver2_phone"
                defaultValue={
                  defaultValue ? defaultValue.drivers[1]?.phone_number : ""
                }
              />
            </Form.Group>
          </Row>
        </>
      )}

      <div className="d-flex justify-content-end mt-4">
        <Button
          variant="primary"
          type="submit"
          disabled={buttonLoader || !truckNumberIsAvailable}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default NewTruckForm;

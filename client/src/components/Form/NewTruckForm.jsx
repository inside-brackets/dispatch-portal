import React, { useState, useRef, useEffect } from "react";
import Input from "../UI/MyInput";
import MySelect from "../UI/MySelect";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import "./newTruckForm.css";
import useHttp from "../../hooks/use-https";
import { useParams } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { Button } from "react-bootstrap";
import axios from "axios";

const transformArrayToObjectArray = (array) => {
  return array.map((item) => ({
    label: `${item.charAt(0).toUpperCase() + item.slice(1)} `,
    value: item.trim(),
  }));
};

const isNotEmpty = (value) => value.trim() !== "";

const NewTruckForm = (props) => {
  const params = useParams();
  const formRef = useRef();

  const {
    value: truckNumber,
    isValid: truckNumberIsValid,
    hasError: truckNumberHasError,
    valueChangeHandler: truckNumberChangeHandler,
    inputBlurHandler: truckNumberBlurHandler,
  } = useInput(isNotEmpty);
  const {
    value: vinNumber,
    isValid: vinNumberIsValid,
    hasError: vinNumberHasError,
    valueChangeHandler: vinNumberChangeHandler,
    inputBlurHandler: vinNumberBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: Driver1Name,
    isValid: Driver1NameIsValid,
    hasError: Driver1NameHasError,
    valueChangeHandler: Driver1NameChangeHandler,
    inputBlurHandler: Driver1NameBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: Driver1Phone,
    isValid: oPhoneIsValid,
    hasError: Driver1PhoneHasError,
    valueChangeHandler: Driver1PhoneChangeHandler,
    inputBlurHandler: Driver1PhoneBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: Driver2Name,
    hasError: Driver2NameHasError,
    valueChangeHandler: Driver2NameChangeHandler,
    inputBlurHandler: Driver2NameBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: Driver2Phone,
    hasError: Driver2PhoneHasError,
    valueChangeHandler: Driver2PhoneChangeHandler,
    inputBlurHandler: Driver2PhoneBlurHandler,
  } = useInput(isNotEmpty);

  const carryLimitRef = useRef();
  const temperatureRestrictionRef = useRef();
  const tripDurrationRef = useRef();
  const Driver1EmailRef = useRef();
  const Driver2EmailRef = useRef();
  const [driverType, setDriverType] = useState("");
  const [selectedTravel, setSelectedTravel] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState([]);
  const [selectedOffDays, setSelectedOffDays] = useState([]);
  const [truckNumberIsAvailable, setTruckNumberIsAvailable] = useState(null);
  const { sendRequest: postTruck } = useHttp();

  const { defaultValue, closeModal, setTrucks } = props;
  useEffect(() => {
    if (defaultValue) {
      setSelectedOffDays(transformArrayToObjectArray(defaultValue.off_days));
      setSelectedTrailer(
        transformArrayToObjectArray([defaultValue.trailer_type])[0]
      );
      truckNumberChangeHandler({
        target: { value: `${defaultValue.truck_number}` },
      });
      vinNumberChangeHandler({
        target: { value: `${defaultValue.vin_number}` },
      });
      Driver1NameChangeHandler({
        target: { value: `${defaultValue.drivers[0].name}` },
      });
      Driver1PhoneChangeHandler({
        target: { value: `${defaultValue.drivers[0].phone_number}` },
      });
      setSelectedTravel(transformArrayToObjectArray(defaultValue.region));
    }
  }, [
    defaultValue,
    truckNumberChangeHandler,
    vinNumberChangeHandler,
    Driver1NameChangeHandler,
    Driver1PhoneChangeHandler,
  ]);

  useEffect(() => {
    setTruckNumberIsAvailable(true);

    const indentifier = setTimeout(async () => {
      if (truckNumber) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/getcarrier`,
          { mc_number: params.mc, "trucks.truck_number": truckNumber }
        );
        console.log("checking truck Number");
        console.log(response.data);
        console.log("truckNumber", truckNumber);
        setTruckNumberIsAvailable(response.data.length === 0);
      }
    }, 250);
    return () => {
      clearTimeout(indentifier);
    };
  }, [truckNumber, params.mc]);

  const handleDriverChange = (event) => {
    setDriverType(event.target.value);
  };
  let formIsValid = false;
  if (
    truckNumberIsValid &&
    vinNumberIsValid &&
    oPhoneIsValid &&
    Driver1NameIsValid &&
    (truckNumberIsAvailable || defaultValue)
  ) {
    formIsValid = true;
  }
  const onSubmit = (e) => {
    if (!formIsValid) {
      return;
    }
    const newTruck = saveTruck();
    const transformData = (data) => {
      console.log("fetch", data);
      setTrucks(data.trucks);
      closeModal();
    };
    postTruck(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/addnewtruck/${params.mc}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: newTruck,
      },
      transformData
    );
  };

  const saveTruck = () => {
    var drivers = [];
    if (driverType === "teamDriver") {
      drivers = [
        {
          name: Driver1Name,
          email_address: Driver1EmailRef.current.value,
          phone_number: Driver1Phone,
        },
        {
          name: Driver2Name,
          email_address: Driver2EmailRef.current.value,
          phone_number: Driver2Phone,
        },
      ];
    } else {
      drivers = [
        {
          name: Driver1Name,
          email_address: Driver1EmailRef.current.value,
          phone_number: Driver1Phone,
        },
      ];
    }

    const saveObj = {
      truck_number: parseInt(truckNumber),
      vin_number: vinNumber,
      trailer_type: selectedTrailer.value,
      carry_limit: parseInt(carryLimitRef.current.value),
      drivers: drivers,
      region: selectedTravel.map((item) => item.value),
      temperature_restriction: parseInt(
        temperatureRestrictionRef.current.value
      ),
      trip_durration: parseInt(tripDurrationRef.current.value),
      off_days: selectedOffDays.map((item) => item.value),
    };
    return saveObj;
  };

  return (
    <form ref={formRef}>
      <Input
        type="number"
        name="truck_number"
        label="*Truck Number:"
        placeholder="Enter 3 digit code.."
        className={truckNumberHasError ? "invalid" : ""}
        onChange={truckNumberChangeHandler}
        onBlur={truckNumberBlurHandler}
        disabled={defaultValue}
        defaultValue={defaultValue ? defaultValue.truck_number : ""}
      />
      {truckNumberHasError && (
        <p className="error-text">Truck number is required.</p>
      )}
      {truckNumberIsAvailable === false && !defaultValue && (
        <p className="error-text">Truck exists.</p>
      )}
      <Input
        type="text"
        label="*Vin Number:"
        placeholder="Enter 17 digit code.."
        className={vinNumberHasError ? "invalid" : ""}
        value={vinNumber}
        onChange={vinNumberChangeHandler}
        onBlur={vinNumberBlurHandler}
        defaultValue={defaultValue ? defaultValue.vin_number : ""}
      />
      {vinNumberHasError && (
        <p className="error-text">Vin number is required.</p>
      )}
      <Input
        type="number"
        label="Carry limit(lbs):"
        placeholder="Enter Maximum carry limit.."
        ref={carryLimitRef}
        defaultValue={defaultValue ? defaultValue.carry_limit : ""}
      />
      <Input
        type="number"
        label="Tempurature Restrictions(F):"
        placeholder="Enter minimum temp limit.."
        ref={temperatureRestrictionRef}
        defaultValue={defaultValue ? defaultValue.temperature_restriction : ""}
      />
      <Input
        type="number"
        label="Trip Duarration(days):"
        placeholder="no. of days.."
        ref={tripDurrationRef}
        defaultValue={defaultValue ? defaultValue.trip_durration : ""}
      />
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
      <div
        style={{
          marginLeft: "20px",
        }}
      >
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
          ]}
        />
      </div>
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
        </RadioGroup>
      </FormControl>
      <Input
        type="text"
        label="Driver 1:"
        placeholder="Diver Name"
        onChange={Driver1NameChangeHandler}
        onBlur={Driver1NameBlurHandler}
        className={Driver1NameHasError ? "invalid" : ""}
        defaultValue={defaultValue ? defaultValue.drivers[0].name : ""}
      />
      {Driver1NameHasError && (
        <p className="error-text">Driver name is required.</p>
      )}
      <Input
        type="text"
        placeholder="Drviver Email"
        ref={Driver1EmailRef}
        defaultValue={defaultValue ? defaultValue.drivers[0].email_address : ""}
      />
      <Input
        type="text"
        placeholder="Drviver Phone Number"
        className={Driver1PhoneHasError ? "invalid" : ""}
        onChange={Driver1PhoneChangeHandler}
        onBlur={Driver1PhoneBlurHandler}
        defaultValue={defaultValue ? defaultValue.drivers[0].phone_number : ""}
      />
      {Driver1PhoneHasError && (
        <p className="error-text">Drviver Phone Number is required.</p>
      )}
      {driverType === "teamDriver" && (
        <div>
          {" "}
          <Input
            type="text"
            label="Driver 2:"
            placeholder="Diver Name"
            className={Driver2NameHasError ? "invalid" : ""}
            onChange={Driver2NameChangeHandler}
            onBlur={Driver2NameBlurHandler}
            defaultValue={defaultValue ? defaultValue.drivers[1].name : ""}
          />
          {Driver2NameHasError && (
            <p className="error-text">Driver name is required.</p>
          )}
          <Input
            type="text"
            placeholder="Drviver Email"
            ref={Driver2EmailRef}
            defaultValue={defaultValue ? defaultValue.drivers[1].name : ""}
          />
          <Input
            type="text"
            placeholder="Drviver Phone Number"
            className={Driver2PhoneHasError ? "invalid" : ""}
            onChange={Driver2PhoneChangeHandler}
            onBlur={Driver2PhoneBlurHandler}
            defaultValue={defaultValue ? defaultValue.drivers[1].name : ""}
          />
          {Driver2PhoneHasError && (
            <p className="error-text">Drviver Phone Number is required.</p>
          )}
        </div>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="primary" onClick={onSubmit} disabled={!formIsValid}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default NewTruckForm;

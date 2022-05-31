import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadsActions } from "../../store/loads";
import MySelect from "../UI/MySelect";
import moment from "moment";

const NewLoadForm = ({ carrier, truck_number, setEditModal, defaultValue }) => {
  const [validated, setValidated] = useState("");
  const [loadNumber, setLoadNumber] = useState(
    defaultValue ? defaultValue.load_number : ""
  );
  const [image, setImage] = useState("");
  const [weight, setWeight] = useState(defaultValue ? defaultValue.weight : "");
  const [miles, setMiles] = useState(defaultValue ? defaultValue.miles : "");
  const [pay, setPay] = useState(defaultValue ? defaultValue.pay : "");
  const [broker, setBroker] = useState(defaultValue ? defaultValue.broker : "");
  const [loadNumberIsValid, setLoadNumberIsValid] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [pickupAddress, setPickupAddress] = useState(
    defaultValue ? defaultValue.pick_up.address : ""
  );
  const [dropAddress, setDropAddress] = useState(
    defaultValue ? defaultValue.drop.address : ""
  );
  const [pickupDate, setPickupDate] = useState(
    defaultValue ? new Date(defaultValue.pick_up.date) : ""
  );

  const [dropDate, setDropDate] = useState(
    defaultValue ? new Date(defaultValue.drop.date) : ""
  );

  const dispatch = useDispatch();

  const [lstatus, setLstatus] = useState();
  useEffect(() => {
    if (defaultValue) {
      if (defaultValue.l_status === "booked") {
        setLstatus({ label: "Booked ", value: "booked" });
      } else if (defaultValue.l_status === "ongoing") {
        setLstatus({ label: "Ongoing ", value: "ongoing" });
      } else if (defaultValue.l_status === "delivered") {
        setLstatus({ label: "Delivered ", value: "delivered" });
      } else if (defaultValue.l_status === "canceled") {
        setLstatus({ label: "Canceled", value: "canceled" });
      }
    }

    const indentifier = setTimeout(async () => {
      if (loadNumber.toString() !== defaultValue?.load_number.toString()) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/getload`,
          { load_number: loadNumber }
        );
        setLoadNumberIsValid(response.data.length === 0);
      } else {
        setLoadNumberIsValid(true);
      }
    }, 250);
    return () => {
      clearTimeout(indentifier);
    };
  }, [defaultValue, loadNumber]);

  const { _id: currUserId } = useSelector((state) => state.user.user);
  const truck = carrier.trucks.find((item) => {
    return item.truck_number.toString() === truck_number.toString();
  });

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/ratecons/${loadNumber}-${file.name}`
    );
    axios.put(url, file);
    setImage(url.split("?")[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true && loadNumberIsValid) {
      setButtonLoader(true);
      const loadObject = {
        load_number: loadNumber.toLowerCase(),
        l_status: "booked",
        weight: weight,
        miles: miles,
        pay: pay,
        ratecon: image,
        dispatcher: currUserId,
        broker: broker.toLowerCase(),
        pick_up: {
          address: pickupAddress,
          date: new Date(pickupDate),
        },

        drop: {
          address: dropAddress,
          date: new Date(dropDate),
        },

        carrier: {
          mc_number: carrier.mc_number,
          _id: carrier._id,
          truck_number: truck.truck_number,
          trailer_type: truck.trailer_type,
          driver: {
            name: truck.drivers[0].name,
            email_address: truck.drivers[0].email_address,
            phone_number: truck.drivers[0].phone_number,
          },
        },
      };
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/dispatch/addnewload`,
          loadObject
        )
        .then((res) => {
          dispatch(loadsActions.append(res.data));
          setButtonLoader(false);
          setEditModal(false);
        })
        .catch((err) => console.log(err));
    }
    // window.location.reload();
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true && loadNumberIsValid) {
      setButtonLoader(true);
      console.log("pick up", pickupDate);
      const loadEditObject = {
        id: defaultValue._id,
        load_number: loadNumber.toLowerCase(),
        l_status: lstatus.value,
        weight: weight,
        miles: miles,
        pay: pay,
        dispatcher: currUserId,
        broker: broker.toLowerCase(),
        pick_up: {
          address: pickupAddress,
          date: new Date(pickupDate),
        },

        drop: {
          address: dropAddress,
          date: new Date(dropDate),
        },
        carrier: {
          mc_number: carrier.mc_number,
          _id: carrier._id,
          truck_number: truck.truck_number,
          trailer_type: truck.trailer_type,
          driver: {
            name: truck.drivers[0].name,
            email_address: truck.drivers[0].email_address,
            phone_number: truck.drivers[0].phone_number,
          },
        },
      };

      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/dispatch/updateload`,
          loadEditObject
        )
        .then((res) => {
          dispatch(loadsActions.replace(res.data));
          setButtonLoader(false);
          setEditModal(false);
        })
        .catch((err) => console.log(err));
    }
    // window.location.reload();
  };

  const body = (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Load Number</Form.Label>
            <Form.Control
              className={`${
                loadNumber && !loadNumberIsValid ? "loadNumber is-invalid" : ""
              } no__feedback shadow-none`}
              value={loadNumber}
              onChange={(e) => {
                setLoadNumber(e.target.value);
              }}
              type="text"
              placeholder="Enter load Number"
            />
            {loadNumberIsValid && loadNumber && (
              <Form.Text style={{ color: "green" }}>
                load Number is available!
              </Form.Text>
            )}
            {loadNumberIsValid === false && loadNumber && (
              <Form.Text style={{ color: "red" }}>
                Load Number already exists.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Load Weight:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter here"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid weight.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Miles:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter here"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid weight.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Pay:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter here"
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Pay.
            </Form.Control.Feedback>
          </Form.Group>{" "}
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Broker:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Borker Company Name"
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid broker.
            </Form.Control.Feedback>
          </Form.Group>{" "}
        </Row>
        <hr />
        <h3>First Pick Up</h3>
        <Row>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Pick-up Address:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter here"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Pick-up address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Pick-up date:</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder="Enter here"
              value={moment(pickupDate).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) => {
                setPickupDate(e.target.value);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Pick-up date.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <hr />
        <h3>Last Drop</h3>
        <Row>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Drop address:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter here"
              value={dropAddress}
              onChange={(e) => setDropAddress(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Drop address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Drop date:</Form.Label>
            <Form.Control
              type="datetime-local"
              min={pickupDate}
              disabled={!pickupDate}
              placeholder="Enter here"
              value={moment(dropDate).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) => setDropDate(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Drop date.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group>
            <Form.Label>RateCon</Form.Label>
            <Form.Control
              type="text"
              name="image"
              placeholder="Enter image url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              readOnly
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Please provide a File.
            </Form.Control.Feedback>
            <Form.File
              id="image-file"
              label="Choose Image"
              custom
              onChange={uploadFileHandler}
            ></Form.File>
          </Form.Group>
        </Row>
        {defaultValue && (
          <MySelect
            label="Status:"
            isMulti={false}
            value={lstatus}
            defaultValue={{ label: "Booked ", value: "booked" }}
            onChange={setLstatus}
            options={[
              { label: "Booked ", value: "booked" },
              { label: "Ongoing ", value: "ongoing" },
              { label: "Delivered ", value: "delivered" },
              { label: "Canceled", value: "canceled" },
            ]}
          />
        )}
        <Row>
          <Col
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            {!defaultValue ? (
              <Button
                disabled={buttonLoader}
                type="submit"
                onSubmit={handleSubmit}
              >
                Add Load
              </Button>
            ) : (
              <Button disabled={buttonLoader} onClick={handleEditSubmit}>
                Edit Load
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );

  return <div>{body}</div>;
};

export default NewLoadForm;

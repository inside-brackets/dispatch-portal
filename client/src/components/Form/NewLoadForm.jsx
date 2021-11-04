import React, { useState } from "react";
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
  const [pickupAddress, setPickupAddress] = useState(
    defaultValue ? defaultValue.pick_up.address : ""
  );
  const [dropAddress, setDropAddress] = useState(
    defaultValue ? defaultValue.drop.address : ""
  );
  const [pickupDate, setPickupDate] = useState(
    defaultValue
      ? moment(defaultValue.pick_up.date).format("YYYY-MM-DDTHH:mm:ss")
      : ""
  );

  const [dropDate, setDropDate] = useState(
    defaultValue
      ? moment(defaultValue.drop.date).format("YYYY-MM-DDTHH:mm:ss")
      : ""
  );

  const dispatch = useDispatch();

  const [lstatus, setLstatus] = useState(
    defaultValue ? defaultValue.l_status : ""
  );
  const { _id: currUserId, user_name: currUserName } = useSelector(
    (state) => state.user.user
  );
  console.log("currUserName", currUserName);
  const truck = carrier.trucks.find((item) => {
    return item.truck_number.toString() === truck_number.toString();
  });
  const uploadFileHandler = async (e) => {
    console.log("hello world");
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/uploadfile/ratecons`,
        formData,
        config
      )
      .then((res) => {
        console.log("image url", res.data);
        setImage(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      const loadObject = {
        load_number: loadNumber,
        l_status: "booked",
        weight: weight,
        miles: miles,
        pay: pay,
        ratecons: image,
        dispatcher: { _id: currUserId, name: currUserName },
        broker: broker,
        pick_up: {
          address: pickupAddress,
          date: pickupDate,
        },

        drop: {
          address: dropAddress,
          date: dropDate,
        },

        carrier: {
          mc_number: carrier.mc_number,
          carrierId: carrier._id,
          truck_number: truck.truck_number,
          trailer_type: truck.trailer_type,
          driver: {
            name: truck.drivers[0].name,
            email_address: truck.drivers[0].email_address,
            phone_number: truck.drivers[0].phone_number,
          },
        },
      };
      setEditModal(false);
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/dispatch/addnewload`,
          loadObject
        )
        .then((res) => {
          dispatch(loadsActions.append(res.data));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      console.log(truck.drivers);
      const loadEditObject = {
        id: defaultValue._id,
        load_number: loadNumber,
        l_status: lstatus.value,
        weight: weight,
        miles: miles,
        pay: pay,
        dispatcher: { _id: currUserId, name: currUserName },
        broker: broker,
        pick_up: {
          address: pickupAddress,
          date: pickupDate,
        },

        drop: {
          address: dropAddress,
          date: dropDate,
        },

        carrier: {
          mc_number: carrier.mc_number,
          carrierId: carrier._id,
          truck_number: truck.truck_number,
          trailer_type: truck.trailer_type,
          driver: {
            name: truck.drivers[0].name,
            email_address: truck.drivers[0].email_address,
            phone_number: truck.drivers[0].phone_number,
          },
        },
      };

      setEditModal(false);

      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/dispatch/updateload`,
          loadEditObject
        )
        .then((res) => {
          dispatch(loadsActions.replace(res.data));
        })
        .catch((err) => console.log(err));
    }
  };

  const body = (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Load Number:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter here"
              value={loadNumber}
              onChange={(e) => setLoadNumber(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Load Number.
            </Form.Control.Feedback>
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
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
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
              placeholder="Enter here"
              value={dropDate}
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
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              name="image"
              placeholder="Enter image url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
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
              <Button type="submit" onSubmit={handleSubmit}>
                Add Load
              </Button>
            ) : (
              <Button onClick={handleEditSubmit}>Edit Load</Button>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );

  return <div>{body}</div>;
};

export default NewLoadForm;

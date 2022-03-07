import axios from "axios";
import { useState } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { str } from "../../data/usStates";

const AddNewCarrierModal = ({ mc, closeModal }) => {
  const [validated, setValidated] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
     if (form.checkValidity() === true) {
      setButtonLoader(true);
      const obj = {
        mc_number: event.target.mc_number.value,
        company_name: event.target.company_name.value,
        address: event.target.address.value,
        phone_number: event.target.phone_number.value,
        usdot_number: event.target.usdot_number.value,
        email: event.target.email.value,
        c_status: "unassigned",
      };
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/add-new-carrier`, obj)
        .then((response) => {
          console.log("response", response);
          history.push(`/addCarrier/${event.target.mc_number.value}`);
          closeModal();
        });
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mx-1">
        <Form.Group as={Col} md="6">
          <Form.Label>MC Number</Form.Label>
          <Form.Control
            name="mc_number"
            type="text"
            placeholder="MC"
            defaultValue={mc}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Company Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Company Name"
            name="company_name"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Company Name.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3 justify-content-center">
        <Row className="m-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              name="address"
              pattern={`^(?!.*(cat)).*(${str}).*`}
              required
            ></Form.Control>

            <Form.Control.Feedback type="invalid">
              Please provide a valid Address<br></br> e.g(11 LAKESHORE DR HOLLAND, MA   01521).
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email"
              name="email"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="m-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="phone_number"
              placeholder="Phone No."
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Phone No.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>US Dot Number</Form.Label>
            <Form.Control
              type="number"
              name="usdot_number"
              placeholder="US Dot Number"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid US Dot Number.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
      </Row>
      <Button disabled={buttonLoader} type="submit">
        Submit form
      </Button>
    </Form>
  );
};

export default AddNewCarrierModal;

import React, {useState,useEffect } from "react";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import MySelect from "../UI/MySelect";
import CreatableSelect from 'react-select/creatable';
import axios from "axios";
import { toast } from "react-toastify";

const ExpenseModal = ({defaultValue, onSuccess }) => {
    console.log(defaultValue?._id,"")
  const [state, setState] = useState();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });
  const defaultOptions = [  ];

  useEffect(async() => {
    let {data} = await axios.get('/accounts/expense/categories')
    data.map((category) =>{
        let value = createOption(category)
        defaultOptions.push(value)
    })
  })


  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [value, setValue] = useState();

 



  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);

      return;
    }
    setLoading(true);

    if (!defaultValue) {
      axios
        .post(`/accounts/expense`,
        {desc:event.target.desc.value,
        amount:event.target.amount.value,
        category:value?value.value:"other"
        }
        )
        .then((res) => {
          onSuccess();
          toast.success("Expense Created Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.msg ?? err.response.statusText);
          setLoading(false);
        });
    } else {
      await axios
        .put(
          `/accounts/expense/${defaultValue._id}`,
        {desc:event.target.desc.value,
        amount:event.target.amount.value,
        category:value?value.value:"other"
        }
        )
        .then((res) => {
          onSuccess();
          toast.success("Expense Updated Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response?.data.msg ?? err.response.statusText);
          setLoading(false);
        });
    }
  };

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  };

  return (
    <>
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
    <Row>
        <Col md={6}>

        <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              placeholder="Amount"
              required
              name="amount"
              min={0}
              defaultValue={defaultValue ? defaultValue.amount : null}
            //   onChange={handleChange}
              type="number"
            />
          </Form.Group>


        </Col>
       <Col md={6}>
       <Form.Label>Category</Form.Label>
       {/* <MySelect
              isMulti={false}
            //   value={selectedCarrierStatus}
            //   onChange={setSelectedCarrierStatus}
              options={[
                { label: "item1", value: "item1" },
                { label: "item2 ", value: "item2" },
              ]}
            /> */}

<CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={(newValue) => setValue(newValue)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
       </Col>

    </Row>
    <Row >
    <Col md={6}>
        <Form.Group >
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              aria-label="With textarea"
              type="text"
              placeholder="Description"
            //   onChange={handleChange}
              defaultValue={defaultValue ? defaultValue.desc : null}
              name="desc"
            />
          </Form.Group>
        </Col>
    </Row>
    <Row className="mt-3">
            <Col md="6">
              <Button
            //    disabled={loading} 
               type="submit">
                {" "}
                {/* {loading && ( */}
                  {/* <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  /> */}
                {/* )} */}
                Submit
              </Button>
            </Col>
          </Row>
    </Form>
    </>
  );
};

export default ExpenseModal;

import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user";
import { getRefreshToken } from "../../utils/utils";

const AddDocuments = ({ showModal,user,profile,callBack }) => {
  const [type, setType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(false);
  // const { user } = useSelector((state) => state.user);s
  const dispatch = useDispatch();

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    e.stopPropagation();
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/user_documents/${user._id}.${
        selectedFile.type.split("/")[1]
      }/${user.profile_image?.substring(
        user.profile_image?.lastIndexOf("/") + 1
      )}`
    );
    console.log("url imaeg", url, "user._id", user._id);
    await axios.put(url, selectedFile);
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/updateuser/${user._id}`,
      {
        files: {
          name: name,
          file_type: type.value,
          file: url.split("?")[0],
        },
        updateFiles:true
      }
    );
    if(profile){
      dispatch(
        userActions.login({
          user: res.data,
          company:
            res.data.company === "alpha"
              ? {
                  label: "Alpha Dispatch Service",
                  value: "alpha",
                }
              : {
                  label: "Elite Dispatch Service",
                  value: "elite",
                },
        })
      );
      getRefreshToken(res.data._id);
  
    } else {
callBack()
    }
    showModal();
  };
  return (
    <Row>
      <Col>
        <Form onSubmit={handleSubmit}>
          <Row className='justify-content-center'>
            <Form.Group as={Col} md={10} controlId="validationCustom01">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row  className='justify-content-center'>
            <Form.Group as={Col} md={10} >
              <Form.Label>Type</Form.Label>
              <Select
                value={type}
                onChange={setType}
                options={[
                  { label: "CNIC", value: "cnic" },
                  {
                    label: "Educational Document",
                    value: "educational_document",
                  },
                  {
                    label: "Experience Document",
                    value: "experience_document",
                  },
                  { label: "Other", value: "other" },
                  { label: "CV", value: "cv" },
                  { label: "Contract", value: "contract" },
                ]}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Date.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row  className='justify-content-center'>
            <Form.Group as={Col} md={10} className="position-relative my-5">
              <Form.Label>Attachments</Form.Label>
              <Form.Control
                type="file"
                required
                name="file"
                onChange={onSelectFile}
              />
              <Form.Control.Feedback
                type="invalid"
                tooltip
              ></Form.Control.Feedback>
            </Form.Group>
          </Row>{" "}
          <Button
            style={{
              float: "right",
            }}
            disabled={loading}
            type="submit"
          >
            Add
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default AddDocuments;

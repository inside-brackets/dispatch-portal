import React, { useState, useEffect } from "react";
import { Row, Col, Form, Image, Button } from "react-bootstrap";
import axios from 'axios'

const UploadProfilePicture = ({user}) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

const handleSubmit = async ()=>{
  // console.log("preview", selectedFile,{file:})
  if (preview) {
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url/user_profile_images/${user._id}.${selectedFile.type.split('/').[1]}/false`
    );
    console.log("url imaeg",url,"user._id",user._id)
await    axios.put(url, selectedFile);
await axios.post(
  `${process.env.REACT_APP_BACKEND_URL}/updateuser/${user._id}`,
  {
    profile_image: url.split("?")[0]
  }
);
  }
}

  return (
    <>
    <Row>
      <Col>
        <h5>Select Picture</h5>
        <hr />
        <Row>
          <Col className="upload-image">
            <Row className="justify-content-center">
              <Col md={6}>Upload Image</Col>{" "}
            </Row>
          </Col>
        </Row>
        <Row className='justify-content-center'>
      <Col md={6}>
        <input onChange={onSelectFile} type="file" required name="file" />
        </Col>
        </Row>
      </Col>
      <Col>
        <h5>Preview</h5>
        <hr />
        {selectedFile && <Image fluid src={preview} />}
      </Col>
    </Row>
    <Row>
      <Col></Col>
      <Col md={3}>
      <Button>Cancel</Button>
      </Col>
      <Col md={3}>
      <Button disabled={!preview} onClick={handleSubmit}>Save Changes</Button>
    
      </Col>
    </Row>
  </>);
};

export default UploadProfilePicture;

import React, { useState, useEffect } from "react";
import { Row, Col, Image, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../../../store/user";
import { getRefreshToken } from "../../../utils/utils";

const UploadProfilePicture = ({ user, setModal }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

  const handleSubmit = async () => {
    // console.log("preview", selectedFile,{file:})
    setLoading(true);
    if (preview) {
      const { data: url } = await axios(
        `${process.env.REACT_APP_BACKEND_URL}/s3url/user_profile_images/${
          user._id
        }.${selectedFile.type.split("/")[1]}/${user.profile_image?.substring(
          user.profile_image?.lastIndexOf("/") + 1
        )}`
      );
      console.log("url imaeg", url, "user._id", user._id);
      await axios.put(url, selectedFile);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/updateuser/${user._id}`,
        {
          profile_image: url.split("?")[0],
        }
      );

      dispatch(
        userActions.login({
          user: res.data,
          company:
            res.data.company === "alpha"
              ? {
                  label: "Company B",
                  value: "alpha",
                }
              : {
                  label: "Company A",
                  value: "elite",
                },
        })
      );
      getRefreshToken(res.data._id);

      setModal(preview);
    }
  };

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
          <Row className="justify-content-center">
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
      <Row className='justify-content-end mt-3'>

        <Col md={2}>
          <Button className='w-100' onClick={() => setModal()}>Cancel</Button>
        </Col>
        <Col md={3}>
          <Button disabled={!preview} onClick={handleSubmit}>
            {" "}
            {loading && (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            Save Changes{" "}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default UploadProfilePicture;

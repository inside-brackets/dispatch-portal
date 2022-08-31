import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import axios from "axios";

import AddDocuments from "../components/modals/AddDocuments";
import DeleteConfirmation from "../components/modals/DeleteConfirmation";
import MyModal from "../components/modals/MyModal";

const Documents = ({ user, profile,callBack }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModa] = useState(false);
  const submitDelete = async () => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/updateuser/${user._id}`,
      {
        files: user.files.filter((item) => item._id !== deleteModal._id),
      }
    );
    await axios(
      `${process.env.REACT_APP_BACKEND_URL}/s3url-delete/user_documents/${deleteModal.file?.substring(
        deleteModal.file?.lastIndexOf("/") + 1
      )}`
    )
    setDeleteModa(false)
    callBack()

  };

  return (
    <Card style={{ border: "none", minHeight: "100vh" }}>
      <Col className="mx-3">
        <Row className="mt-3 mb-5">
          <Col>
            <h4>Documents</h4>
          </Col>
          <Col className="mb-4" md={2}>
            <p
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
                textDecorationLine: "underline",
              }}
              onClick={() => setShowModal(true)}
            >
              {" "}
              + Add Document
            </p>
          </Col>
          <hr />
        </Row>

        {user.files?.map((file) => {
          return (
            <>
              <Row className="justify-content-end">
                <Col md={10}>
                  <h5> {file.name} </h5>
                </Col>
                <Col md={2}>
                  {" "}
                  <a href={file.file}>
                    <i className="bx bx-file action-button"></i>
                  </a>
                  <span  onClick={() => setDeleteModa(file)}>
                    <i className="bx bx-trash-alt action-button"></i>
                  </span>{" "}
                </Col>
              </Row>
              <hr />
            </>
          );
        })}
      </Col>
      <MyModal
        size="lg"
        show={showModal}
        heading="Add Document"
        onClose={() => setShowModal(false)}
        style={{ width: "auto" }}
      >
        <AddDocuments
          profile={profile}
          user={user}
          callBack={()=> callBack()}
          showModal={() => setShowModal(false)}
        />
      </MyModal>
      <DeleteConfirmation
        showModal={deleteModal}
        confirmModal={submitDelete}
        hideModal={() => setDeleteModa(false)}
        message={"Are you Sure to want to delete File?"}
        title="Delete Confirmation"
      />
    </Card>
  );
};

export default Documents;

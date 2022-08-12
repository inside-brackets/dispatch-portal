import React, { useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

import AddDocuments from "../components/modals/AddDocuments";
import MyModal from "../components/modals/MyModal";

const Documents = () => {
  const { user } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
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
                textDecorationLine:'underline'
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
                  <a href={file.file}><i className="bx bx-file action-button"></i></a>{" "}
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
        <AddDocuments showModal={()=>setShowModal(false)} />
      </MyModal>
    </Card>
  );
};

export default Documents;

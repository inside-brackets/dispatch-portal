import { Row, Col, Card } from "react-bootstrap";
const FormContainer = ({ title, size, children }) => {
  if (!size) {
    size = 6;
  }
  return (
    <Row
      style={{ padding: "0 0 0 100px" }}
      className="justify-content-start align-items-center vh-100 vw-100"
    >
      <Col md={size}>
        {title ? (
          <Card>
            <Card.Body>
              <Card.Title as="h2" className="text-center">
                {title}
              </Card.Title>
              <hr />
              {children}
            </Card.Body>
          </Card>
        ) : (
          children
        )}
      </Col>
    </Row>
  );
};

export default FormContainer;

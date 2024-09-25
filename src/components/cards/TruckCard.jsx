import React from "react";

import { Row, Col, Card } from "react-bootstrap";
import Badge from "../../components/badge/Badge";
import moment from "moment";

import truck_status_map from "../../assets/JsonData/truck_status_map.json";
import load_status_map from "../../assets/JsonData/load_status_map.json";
import "./truckCard.css";
const body = (carrier) => (
  <div>
    <Row>
      <Col>
        <span className="b">MC: </span>
      </Col>
      <Col>
        <span className=""> {carrier.mc_number}</span>
      </Col>
    </Row>

    <Row>
      <Col>
        <span className="b ">Truck #:</span>
      </Col>
      <Col>
        <span className="">{carrier.truck_number}</span>
      </Col>
    </Row>
    <Row>
      <Col>
        <span className="b ">Trailer Type</span>
      </Col>
      <Col>
        <span className="">{carrier.trailer_type}</span>
      </Col>
    </Row>
    <Row>
      <Col>
        <span className="b ">Driver:</span>
      </Col>
      <Col>
        <span className="">{carrier.driver}</span>
      </Col>
    </Row>
    <Row>
      <Col>
        <span className="b ">Tr. Status:</span>
      </Col>
      <Col>
        <span className="">
          <Badge
            className="mytrucks-cards-badge"
            type={truck_status_map[carrier.truck_status]}
            content={carrier.truck_status}
          />
        </span>
      </Col>
    </Row>
    <Row>
      <Col>
        <span className="b ">Load Status:</span>
      </Col>
      <Col>
        <span className="">
          <Badge
            className="mytrucks-cards-badge"
            type={
              load_status_map[
                carrier.load_status ? carrier.load_status : "empty"
              ]
            }
            content={carrier.load_status ? carrier.load_status : "empty"}
          />
        </span>
      </Col>
    </Row>
  </div>
);

const TruckCard = ({ item }) => {
  return (
    <Card
      style={{
        width: "290px",
      }}
      className={`${item.out_of ? "" : "newCarrierBackground"}`}
    >
      <Card.Body className="cardBody">
        <Card.Title className="card-title">{item.company_name}</Card.Title>

        <hr />
        <Card.Text>{body(item)}</Card.Text>
        <Card.Footer
          style={{
            width: "auto",
            height: "45px",
          }}
        >
          {item.out_of ? (
            <div>
              {`Next load : ${moment(new Date(item.next)).format("ll")}`}
              <br />
              {`Time: \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ${moment(
                new Date(item.next)
              ).format("LT")}`}
              <br />
              {`Out of:\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  ${item.out_of}`}
            </div>
          ) : (
            <div className="newCarrierContainer" style={{ height: "30px" }}>
              <h4 className="text-center ">New Carrier!</h4>
            </div>
          )}
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default TruckCard;

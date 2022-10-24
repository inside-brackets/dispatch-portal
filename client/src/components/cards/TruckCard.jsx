import React from "react";

import { Row, Col, Card } from "react-bootstrap";
import Badge from "../../components/badge/Badge";
import moment from "moment";

import truck_status_map from "../../assets/JsonData/truck_status_map.json";
import load_status_map from "../../assets/JsonData/load_status_map.json";
import './truckCard.css';
const body = (carrier) => (
  <div>
    <Row>
      <Col>
        <h5>MC: </h5>
      </Col>
      <Col>
        <h6> {carrier.mc_number}</h6>
      </Col>
    </Row>

    <Row>
      <Col>
        <h5>Truck #:</h5>
      </Col>
      <Col>
        <h6>{carrier.truck_number}</h6>
      </Col>
    </Row>
    <Row>
      <Col>
        <h5>Trailer Type</h5>
      </Col>
      <Col>
        <h6>{carrier.trailer_type}</h6>
      </Col>
    </Row>
    <Row>
      <Col>
        <h5>Driver:</h5>
      </Col>
      <Col>
        <h6>{carrier.driver}</h6>
      </Col>
    </Row>
    <Row>
      <Col>
        <h5>Truck Status:</h5>
      </Col>
      <Col>
        <h6>
          <Badge
            type={truck_status_map[carrier.truck_status]}
            content={carrier.truck_status}
          />
        </h6>
      </Col>
    </Row>
    <Row>
      <Col>
        <h5>Load Status:</h5>
      </Col>
      <Col>
        <h6>
          <Badge
            type={
              load_status_map[
                carrier.load_status ? carrier.load_status : "empty"
              ]
            }
            content={carrier.load_status ? carrier.load_status : "empty"}
          />
        </h6>
      </Col>
    </Row>
  </div>
);

const TruckCard = ({ item }) => {
  return (
    <Card  style={{
      minWidth:"368px"
    }} className={`${item.out_of ? '':'newCarrierBackground'}`}>
      <Card.Body className="cardBody">
        <Card.Title>{item.company_name}</Card.Title>

        <hr />
        <Card.Text className="">{body(item)}</Card.Text>
        <Card.Footer
          style={{
            width: "auto",
            height:"auto",
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
            <div className="newCarrierContainer">
            <h3 className="text-center ">New Carrier!</h3>
            </div>
          )}
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default TruckCard;

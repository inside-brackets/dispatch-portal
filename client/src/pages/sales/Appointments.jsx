import React, { useEffect, useState } from "react";
// import SimpleCard from "../components/cards/SimpleCard";
import { Link } from "react-router-dom";
import useHttp from "../../hooks/use-https";
import Loader from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
const Appointments = () => {
  const { _id: currUserId } = useSelector((state) => state.user.user);
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();
  const [carriersList, setCarriersList] = useState([]);

  useEffect(() => {
    const transformData = (data) => {
      if (data === null) {
        return;
      }
      data.sort((a, b) => {
        return new Date(a.appointment) - new Date(b.appointment);
      });
      setCarriersList(data);
    };
    fetchCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/getcarriers`,
        method: "POST",
        body: {
          salesman: currUserId,
          c_status: "appointment",
        },
      },
      transformData
    );
  }, [fetchCarriers, currUserId]);
  const body = (carrier) => (
    <Row>
      <Col>
        <h5>MC: </h5>
      </Col>
      <Col>
        <h6> {carrier.mc_number}</h6>
      </Col>
      <Row>
        <Col>
          <h5>Phone:</h5>{" "}
        </Col>
        <Col>
          <h6>{carrier.phone_number}</h6>
        </Col>
      </Row>
      <Row>
        <h5>Email:</h5>

        <Row>
          <h6>{carrier.email}</h6>
        </Row>
      </Row>
      <Row>
        <Col>
          <h5>Comment:</h5>{" "}
        </Col>
        <div
          style={{
            overflow: "hidden",
          }}
        >
          <Row
            style={{
              maxHeight: 37,
              minHeight: 37,
            }}
          >
            <h6 className="text-muted">
              {carrier.comment?.length >= 62
                ? `${carrier.comment
                    .substring(0, Math.min(carrier.comment.length, 62))
                    .trim()}...`
                : carrier.comment}
            </h6>
          </Row>
        </div>
      </Row>
    </Row>
  );
  if (isLoading && !httpError) {
    return (
      <div className="spreadsheet__loader">
        <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && httpError) {
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  } else if (carriersList.length === 0)
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "green" }}>No Appointments yet.</h2>
      </div>
    );

  return (
    <div className="row">
      {carriersList.map((item, index) => (
        <div className="col-4" key={index}>
          <Link to={`/appointments/${item.mc_number}`}>
            {
              <Card
                className="my-card"
                style={{
                  width: "auto",
                  height: "auto",
                  border: "light",
                }}
              >
                <Card.Body>
                  <Card.Title>{item.company_name}</Card.Title>
                  <hr />
                  <Card.Text className="">{body(item)}</Card.Text>
                  <Card.Footer className="card-title ">
                    {
                      <h5>{`Time: ${new Date(
                        item.appointment
                      ).toLocaleString()}`}</h5>
                    }
                  </Card.Footer>
                </Card.Body>
              </Card>
            }
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Appointments;

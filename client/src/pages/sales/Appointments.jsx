import React, { useEffect, useState, useRef } from "react";
// import SimpleCard from "../components/cards/SimpleCard";
import { Link } from "react-router-dom";
import useHttp from "../../hooks/use-https";
import Loader from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import moment from "moment";

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
        return new Date(b.appointment - new Date(a.appointment));
      });
      setCarriersList(data);
      setSearchedCarrier(data);
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

  //search
  const searchRef = useRef();

  const [searchedCarrier, setSearchedCarrier] = useState([]);
  const search = (e) => {
    if (e.key === "Enter") {
      var searchValue = searchRef.current.value.trim();
      const searched = carriersList.filter((carrier) => {
        if (!isNaN(searchValue)) {
          return carrier.mc_number === parseInt(searchRef.current.value.trim());
        } else {
          searchValue = searchValue.toLowerCase();
          if (
            carrier.company_name
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          ) {
            return true;
            // return load.broker === searchRef.current.value.trim();
          }
          return false;
        }
      });
      if (searched.length !== 0) {
        setSearchedCarrier(searched);
      } else {
        setSearchedCarrier(carriersList);
      }
    }
  };

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
          <h6>
            {carrier.email?.length >= 19
              ? `${carrier.email
                  .substring(0, Math.min(carrier.email.length, 19))
                  .trim()}...`
              : carrier.email}
          </h6>
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
      <div className="row align-items-center mb-3">
        <div className="col-md-3">
          <label>Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Company / MC"
            icon="bx bx-search"
            ref={searchRef}
            onKeyDown={search}
          />
        </div>
      </div>
      {searchedCarrier.map((item, index) => (
        <div className="col-4" key={index}>
          <Link to={`/appointments/${item.mc_number}`}>
            {
              <Card
                className="hvr-scale"
                style={{
                  minHeight: "430px",
                  border: "light",
                }}
              >
                <Card.Body>
                  <Card.Title
                    style={{
                      height: "40px",
                    }}
                  >
                    {item.company_name}
                  </Card.Title>
                  <hr />
                  <Card.Text className="">{body(item)}</Card.Text>
                  <Card.Footer className="card-title ">
                    {
                      <h5>{`Time: ${moment(item.appointment).format(
                        "llll"
                      )}`}</h5>
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

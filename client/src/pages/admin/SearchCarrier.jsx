import React, { useState } from "react";
import axios from "axios";
import {
  InputGroup,
  FormControl,
  Button,
  Col,
  Card,
  Row,
} from "react-bootstrap";

import Loader from "react-loader-spinner";
import Badge from "../../components/badge/Badge";
import { useHistory } from "react-router-dom";
import status_map from "../../assets/JsonData/status_map.json";

const CardRow = ({ field, value, badge }) => {
  return (
    <Row>
      <Col>
        <h5>{`${field}:`}</h5>
      </Col>
      {badge ? (
        <Col>
          <h6>
            <Badge type={status_map[value]} content={value} />
          </h6>
        </Col>
      ) : (
        <Col>
          <h6>{value}</h6>
        </Col>
      )}
    </Row>
  );
};

const SearchCarrier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchedMc, setSearchedMc] = useState("");
  const [carrier, setCarrier] = useState("");

  const history = useHistory();

  const searchCarrier = async () => {
    setIsLoading(true);
    setError(false);
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/getcarrier`,
      { mc_number: searchedMc }
    );
    console.log(result);
    if (result.data) {
      setCarrier(result.data);
    } else {
      setError(true);
    }
    setIsLoading(false);
  };
  let searching = null;
  if (isLoading && !error) {
    searching = (
      <center style={{ marginTop: "10%" }}>
        <Loader type="TailSpin" color="#A9A9A9" height={100} width={100} />
      </center>
    );
  } else if (!isLoading && error) {
    searching = (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "grey" }}>No record Found</h2>
      </div>
    );
  }

  const clickHandler = (path) => {
    history.push(`/${path}/${carrier.mc_number}`);
  };

  return (
    <Card style={{ minHeight: "70vh" }}>
      <div>
        <h1>Add New Carrier:</h1>
        <center>
          <Col lg={4}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by mc number"
                aria-label="Search by mc number"
                aria-describedby="basic-addon2"
                type="number"
                value={searchedMc}
                onChange={(e) => {
                  setSearchedMc(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchCarrier();
                  }
                }}
              />
              <Button
                onClick={searchCarrier}
                variant="outline-secondary"
                id="button-addon2"
              >
                <i class="bx bx-search-alt"></i>
              </Button>
            </InputGroup>
          </Col>
        </center>
        {searching ? (
          searching
        ) : carrier ? (
          <center style={{ marginTop: "50px" }}>
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{carrier.company_name}</Card.Title>
                <hr />
                <CardRow field="Status" value={carrier.c_status} badge={true} />
              </Card.Body>

              <Button
                onClick={() =>
                  clickHandler(
                    carrier.c_status === "unassigned"
                      ? "addcarrier"
                      : "carrierview"
                  )
                }
                variant="primary"
              >
                {carrier.c_status === "unassigned" ? "Assign" : "View"}
              </Button>
            </Card>
          </center>
        ) : (
          <center style={{ marginTop: "10%" }}>
            <h2 style={{ color: "grey" }}>Enter Mc to see carrier's status</h2>
          </center>
        )}
      </div>
    </Card>
  );
};

export default SearchCarrier;

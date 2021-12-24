import React, { useState } from "react";
import axios from "axios";
import { InputGroup, FormControl, Button, Col } from "react-bootstrap";

import Loader from "react-loader-spinner";

const AddCarrier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchedMc, setSearchedMc] = useState("");
  const [result, setResult] = useState("");

  const searchCarrier = async () => {
    setIsLoading(true);
    setError(false);
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/getcarrier`,
      { mc_number: searchedMc }
    );
    console.log(result);
    if (result.data) {
      setResult(result.data);
    } else {
      setError(true);
    }
    setIsLoading(false);
  };
  let searchResult = null;
  if (isLoading && !error) {
    searchResult = (
      <div className="spreadsheet__loader">
        <Loader type="TailSpin" color="#A9A9A9" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && error) {
    searchResult = (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "grey" }}>No record Found</h2>
      </div>
    );
  }

  return (
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
      {searchResult ? (
        searchResult
      ) : (
        <center>
          <h2>{result.company_name}</h2>
        </center>
      )}
    </div>
  );
};

export default AddCarrier;

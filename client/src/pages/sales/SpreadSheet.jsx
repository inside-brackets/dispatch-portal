import React, { useEffect, useState, useRef } from "react";
import Loader from "react-loader-spinner";
import Table from "../../components/table/Table";
// import axios from "axios";
import Badge from "../../components/badge/Badge";
import useHttp from "../../hooks/use-https";
import { useSelector } from "react-redux";
import MySelect from "../../components/UI/MySelect";
import Input from "../../components/UI/MyInput";
import { Col, Row } from "react-bootstrap";

const customerTableHead = [
  "#",
  "MC",
  "Carrier Name",
  "Address",
  "Phone Number",
  "Email",
  "Status",
];

const status_map = {
  unreached: "unreached",
  appointment: "appointment",
  rejected: "danger",
  registered: "success",
  deactivated: "black",
};

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{item.mc_number}</td>
    <td>{item.company_name}</td>
    <td>{item.address}</td>
    <td>{item.phone_number}</td>
    <td>{item.email}</td>
    <td>
      {<Badge type={status_map[item.c_status]} content={item.c_status} />}
    </td>
  </tr>
);

const Customers = () => {
  const searchRef = useRef();
  const { _id: currUserId } = useSelector((state) => state.user.user);
  const [carriers, setCarriers] = useState([]);
  // search
  const [searchedCarrier, setSearchedCarrier] = useState(null);
  const search = (e) => {
    if (e.key === "Enter") {
      const searched = carriers.find((carrier) => {
        return carrier.mc_number === parseInt(searchRef.current.value.trim());
      });

      if (searched) {
        setSearchedCarrier(searched);
      } else {
        setSearchedCarrier(null);
      }
    }
  };
  // filter
  const [filteredCarrier, setFilteredCarrier] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState([]);

  const searchByFilter = (values) => {
    setSelectedFilter(values);
    if (values.length !== 0) {
      const filters = values.map((item) => item.value);
      setFilteredCarrier(
        carriers.filter((item) => filters.includes(item.c_status))
      );
    } else {
      setFilteredCarrier(null);
    }
  };

  // on mount fetch carriers
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();
  useEffect(() => {
    const transformData = (data) => {
      setCarriers(data);
    };
    fetchCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/getcarriers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          "salesman._id": currUserId,
        },
      },
      transformData
    );
  }, [fetchCarriers, currUserId]);

  if (isLoading && !httpError) {
    return (
      <div className="spreadsheet__loader">
        <Loader type="TailSpin" color="#A9A9A9" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && httpError) {
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-header">Spread Sheet</h2>
      <Row className="justify-content-between">
        <Col>
          <Input
            type="text"
            placeholder="Search mc..."
            icon="bx bx-search"
            ref={searchRef}
            onKeyDown={search}
            // ref={Driver1NameRef}
          />
        </Col>
        <Col></Col>
        <Col></Col>

        <Col>
          <MySelect
            isMulti={true}
            value={selectedFilter}
            onChange={searchByFilter}
            // icon="bx bx-filter-alt"
            options={[
              { label: "Appointment ", value: "appointment" },
              { label: "Registered ", value: "registered" },
              { label: "Rejected ", value: "rejected" },
              { label: "Deactivated ", value: "deactivated" },
            ]}
          />
        </Col>
      </Row>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {searchedCarrier && !filteredCarrier && (
                <Table
                  key={searchedCarrier.mc_number}
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={[searchedCarrier]}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
              {!searchedCarrier && filteredCarrier && (
                <Table
                  key={filteredCarrier.length}
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={filteredCarrier}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
              {!searchedCarrier && !filteredCarrier && (
                <Table
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={carriers}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;

import React, { useEffect, useState, useRef } from "react";
import Table from "../../components/table/Table";
// import TruckForm from "../Form/NewTruckForm";
// import Button from "../UI/Button";
import useHttp from "../../hooks/use-https";
import Badge from "../../components/badge/Badge";
import Input from "../../components/UI/MyInput";
import { Col, Row } from "react-bootstrap";
import MySelect from "../../components/UI/MySelect";
import Loader from "react-loader-spinner";

const carrierTableHead = [
  "#",
  "MC",
  "Carrier Name",
  "Address",
  "Phone Number",
  "Email",
  "Sales Person",
  "Dispatcher",
  "Status",
];

const status_map = {
  unreached: "unreached",
  appointment: "appointment",
  rejected: "danger",
  registered: "success",
  deactivated: "warning",
};

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Carriers = () => {
  const searchRef = useRef();
  const [carriers, setCarriers] = useState([]);
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();

  // search
  const [searchedCarrier, setSearchedCarrier] = useState(null);
  const search = (e) => {
    if (e.key === "Enter") {
      var searchValue = searchRef.current.value.trim();
      const searched = carriers.find((carrier) => {
        if (!isNaN(searchValue)) {
          return carrier.mc_number === parseInt(searchRef.current.value.trim());
        } else {
          searchValue = searchValue.toLowerCase();
          if (
            carrier.salesman &&
            carrier.salesman.name.toLowerCase() === searchValue
          ) {
            return true;
          } else if (carrier.dispatcher) {
            return carrier.dispatcher.name.toLowerCase() === searchValue;
          }
          return false;
        }
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

  useEffect(() => {
    const transformData = (data) => {
      setCarriers(data);
    };
    fetchCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/getcarriers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {},
      },
      transformData
    );
  }, [fetchCarriers]);

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.mc_number}</td>
      <td>{item.company_name}</td>
      <td>{item.address}</td>
      <td>{item.phone_number}</td>
      <td>{item.email}</td>
      <td>{item.salesman ? item.salesman.name : "N/A"}</td>
      <td>{item.dispatcher ? item.dispatcher.name : "N/A"}</td>
      <td>
        {<Badge type={status_map[item.c_status]} content={item.c_status} />}
      </td>
    </tr>
  );
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
  } else if (carriers === null)
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "green" }}>No more carriers to show.</h2>
      </div>
    );

  return (
    <div>
      <h2> Carriers Database: </h2>
      <br />
      <Row>
        <Col>
          <Input
            type="text"
            placeholder="MC/ Sales Man/ Dsipatcher"
            icon="bx bx-search"
            ref={searchRef}
            onKeyDown={search}
            // ref={Driver1NameRef}
          />
        </Col>
        <Col>
          <MySelect
            isMulti={true}
            value={selectedFilter}
            onChange={searchByFilter}
            // icon="bx bx-filter-alt"
            options={[
              { label: "Closed ", value: "closed" },
              { label: "Appointment ", value: "appointment" },
              { label: "Registered", value: "registered" },
              { label: "Deactivated ", value: "deactivated" },
              { label: "Unassigned ", value: "unassigned" },
              { label: "Rejected ", value: "rejected" },
              { label: "Unreached ", value: "unreached" },
            ]}
          />
        </Col>

        <Col></Col>
        <Col></Col>
      </Row>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {searchedCarrier && !filteredCarrier && (
                <Table
                  key={searchedCarrier.mc_number}
                  headData={carrierTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={[searchedCarrier]}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
              {!searchedCarrier && filteredCarrier && (
                <Table
                  key={filteredCarrier.length}
                  headData={carrierTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={filteredCarrier}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
              {!searchedCarrier && !filteredCarrier && (
                <Table
                  key={Math.random()}
                  headData={carrierTableHead}
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

export default Carriers;

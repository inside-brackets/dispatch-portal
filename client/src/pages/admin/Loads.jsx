import React, { useEffect, useState, useRef } from "react";
import Table from "../../components/table/Table";
// import TruckForm from "../Form/NewTruckForm";
// import Button from "../UI/Button";
// import useHttp from "../../hooks/use-https";
import { Row, Col } from "react-bootstrap";
import MySelect from "../../components/UI/MySelect";
import Input from "../../components/UI/MyInput";
import Loader from "react-loader-spinner";
import axios from "axios";
import moment from "moment";
import EditButton from "../../components/UI/EditButton";
// import LoadTable from "../../components/table/LoadTable";

const loadTableHead = [
  "#",
  "Load Number",
  "Weight",
  "Miles",
  "Pay",
  "Dispatcher",
  "Broker",
  "Pick Up",
  "Drop",
  "Status",
  "",
];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{item.load_number ? item.load_number : "NA"}</td>
    <td>{item.weight ? item.weight : "NA"}</td>
    <td>{item.miles ? item.miles : "NA"}</td>
    <td>{item.pay ? item.pay : "NA"}</td>
    <td>{item.dispatcher.name ? item.dispatcher.name : "NA"}</td>
    <td>{item.broker ? item.broker : "NA"}</td>
    <td>
      {item.pick_up ? item.pick_up.address : "NA"} <br />{" "}
      {item.pick_up ? moment(item.pick_up.date).format("MMMM Do YYYY") : "NA"}
      <br />
      {item.pick_up ? moment(item.pick_up.date).format("h:mm:ss a") : "NA"}
    </td>
    <td>
      {item.drop ? item.drop.address : "NA"} <br />{" "}
      {item.drop ? moment(item.drop.date).format("MMMM Do YYYY") : "NA"}
      <br />
      {item.drop ? moment(item.drop.date).format("h:mm:ss a") : "NA"}
    </td>
    <td>{item.l_status ? item.l_status : "NA"}</td>

    <td>
      <div className="edit__class">
        <EditButton type="edit" />
        <EditButton
          type="view"
          onClick={() => {
            const pdfWindow = window.open();
            pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${item.ratecons}`;
          }}
        />
      </div>
    </td>
  </tr>
);

const Loads = () => {
  const [loads, setLoads] = useState("");
  useEffect(() => {
    const fetchLoads = async () => {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/getloads`, {})
        .then((res) => setLoads(res.data))
        .catch((err) => console.log(err));
    };
    fetchLoads();
  }, []);
  //search
  const searchRef = useRef();

  const [searchedCarrier, setSearchedCarrier] = useState([]);
  const search = (e) => {
    if (e.key === "Enter") {
      var searchValue = searchRef.current.value.trim();
      const searched = loads.filter((load) => {
        if (!isNaN(searchValue)) {
          return load.load_number === parseInt(searchRef.current.value.trim());
        } else {
          searchValue = searchValue.toLowerCase();
          if (load.broker.toLowerCase().includes(searchValue.toLowerCase())) {
            return true;
          }
          return false;
        }
      });
      if (searched.length !== 0) {
        setSearchedCarrier(searched);
      } else {
        setSearchedCarrier([]);
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
        loads.filter((item) => filters.includes(item.l_status))
      );
    } else {
      setFilteredCarrier(null);
    }
  };

  console.log(loads);
  return (
    <>
      {!loads ? (
        <div className="spreadsheet__loader">
          <Loader type="TailSpin" color="#A9A9A9" height={100} width={100} />
        </div>
      ) : (
        <div>
          <Row>
            <Col md={3}>
              <Input
                type="text"
                placeholder="Load Number / Broker"
                icon="bx bx-search"
                ref={searchRef}
                onKeyDown={search}
                // ref={Driver1NameRef}
              />
            </Col>
            <Col style={{ display: "flex", alignItems: "center" }}>
              <MySelect
                isMulti={true}
                value={selectedFilter}
                onChange={searchByFilter}
                options={[
                  { label: "Booked ", value: "booked" },
                  { label: "Ongoing ", value: "ongoing" },
                  { label: "Delivered ", value: "delivered" },
                  { label: "Canceled ", value: "canceled" },
                ]}
              />
            </Col>

            <div className="card">
              <div className="card__body">
                {searchedCarrier.length !== 0 && !filteredCarrier && (
                  <Table
                    key={Math.random()}
                    headData={loadTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={searchedCarrier}
                    renderBody={(item, index) => renderBody(item, index)}
                  />
                )}
                {searchedCarrier.length === 0 && filteredCarrier && (
                  <Table
                    key={filteredCarrier.length}
                    headData={loadTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={filteredCarrier}
                    renderBody={(item, index) => renderBody(item, index)}
                  />
                )}
                {searchedCarrier.length === 0 && !filteredCarrier && (
                  <Table
                    key={Math.random()}
                    headData={loadTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={loads}
                    renderBody={(item, index) => renderBody(item, index)}
                  />
                )}
              </div>
            </div>
          </Row>
        </div>
      )}
    </>
  );
};

export default Loads;

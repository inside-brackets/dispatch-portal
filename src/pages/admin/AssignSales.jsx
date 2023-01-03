import React, { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import useHttp from "../../hooks/use-https";
import MySelect from "../../components/UI/MySelect";
import Loader from "react-loader-spinner";
import { Button, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { salesActions } from "../../store/sales";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import moment from "moment";

const carrierTableHead = [
  "#",
  "MC",
  "Carrier Name",
  "Truck Number",
  "Trailer Type",
  "Sales Person",
  "Closed",
  "",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const AssignSales = () => {
  const history = useHistory();

  const { carriers } = useSelector((state) => state.sales);
  const dispatch = useDispatch();
  const [dispatchers, setDispatchers] = useState([]);
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();
  const { sendRequest: fetchDispatchers } = useHttp();
  const [selectedDispatcher, setSelectedDispatcher] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(null);

  const { company: selectedCompany } = useSelector((state) => state.user);

  const onAssign = async (mc, truckNumber, index) => {
    if (selectedDispatcher.length === 0) {
      return toast.warn("Please select any dispacther");
    }
    setButtonLoader(index);
    const assignedDispatcher = dispatchers.find((item) => {
      return item.user_name === selectedDispatcher.value;
    });
    await axios({
      url: `/admin/assigndispatcher/${mc}/${truckNumber}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },

      data: {
        id: assignedDispatcher._id,
      },
    });
    const newCarriers = carriers.filter((item) => {
      return !(item.truck_number === truckNumber && item.mc_number === mc);
    });
    setButtonLoader(null);
    dispatch(salesActions.set(newCarriers));
  };
  useEffect(() => {
    const transformData = (data) => {
      dispatch(salesActions.setAndPrepare(data));
    };

    fetchCarriers(
      {
        url: `/getcarriers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          c_status: "registered",
          "trucks.t_status": "new",
          company: selectedCompany.value,
        },
      },
      transformData
    );
    const transformDispatch = (data) => {
      setDispatchers(data);
    };
    fetchDispatchers(
      {
        url: `/getusers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          department: "dispatch",
          designation:"employee",
          company: selectedCompany.value,
        },
      },
      transformDispatch
    );
  }, [fetchDispatchers, fetchCarriers, dispatch, selectedCompany]);

  const renderBody = (item, index) => (
    <tr key={index}>
      <td onClick={() => history.push(`/carrierview/${item.mc_number}`)}>
        {index + 1}
      </td>
      <td onClick={() => history.push(`/carrierview/${item.mc_number}`)}>
        {item.mc_number}
      </td>
      <td onClick={() => history.push(`/carrierview/${item.mc_number}`)}>
        {item.company_name}
      </td>
      <td onClick={() => history.push(`/carrierview/${item.mc_number}`)}>
        {item.truck_number}
      </td>
      <td onClick={() => history.push(`/carrierview/${item.mc_number}`)}>
        {item.trailer_type}
      </td>

      <td onClick={() => history.push(`/carrierview/${item.mc_number}`)}>
        {item.salesman ? item.salesman : "N/A"}
      </td>
      {/* <td>{item.salesman}</td> */}
      <td onClick={() => history.push(`/carrierview/${item.mc_number}`)}>
        {item.updatedAt !== "N/A"
          ? moment(new Date(item.updatedAt)).fromNow()
          : "N/A"}
      </td>
      <td>
        <Button
          style={{ paddingLeft: "40px", paddingRight: "40px" }}
          onClick={() => {
            onAssign(item.mc_number, item.truck_number, index);
          }}
          disabled={buttonLoader}
        >
          {buttonLoader === index && (
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          Assign
        </Button>
      </td>
    </tr>
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
  } else if (carriers === null)
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "green" }}>No more carriers to show.</h2>
      </div>
    );

  return (
    <div>
      <h2> Carriers: </h2>
      <Row className="justify-content-end my-2">
        <Col md={4}>
          <div className="assign__text"> ADD DISPATCHER:</div>
          <MySelect
            isMulti={false}
            value={selectedDispatcher}
            onChange={setSelectedDispatcher}
            options={dispatchers.map((item) => {
              return {
                label: item.user_name, // change later
                value: item.user_name,
              };
            })}
          />
        </Col>
      </Row>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                key={Math.random()}
                limit="10"
                headData={carrierTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={carriers}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSales;

import React, { useEffect, useState } from "react";
import Table from "../components/table/Table";
import useHttp from "../hooks/use-https";
import MySelect from "../components/UI/MySelect";
import Loader from "react-loader-spinner";
import { Button, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { manageAppointmentsActions } from "../store/manageAppointments";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import moment from "moment";

const carrierTableHead = ["#", "MC", "Carrier Name", "Trucks", "Sales Person", "Last Updated", "Assgin"];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const ManageAppointments = () => {
  const history = useHistory();

  const { appointments } = useSelector((state) => state.manageAppointments);
  const dispatch = useDispatch();
  const [salesmen, setSalesmen] = useState([]);
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();
  const { sendRequest: fetchSalesmen } = useHttp();
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(null);

  const { company: selectedCompany } = useSelector((state) => state.user);

  const onAssign = async (mc, truckNumber, index) => {
    if (selectedSalesman.length === 0) {
      return toast.warn("Please select any dispacther");
    }
    setButtonLoader(index);
    await axios({
      url: `/updatecarrier/${mc}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },

      data: {
        salesman: selectedSalesman.value,
        c_status: "appointment",
        manually_assigned: true,
      },
    });
    const newCarriers = appointments.filter((item) => {
      return !(item.mc_number === mc);
    });
    setButtonLoader(null);
    dispatch(manageAppointmentsActions.set(newCarriers));
    toast.success("Carrier assigned successfully!");
  };
  useEffect(() => {
    const transformData = (data) => {
      dispatch(manageAppointmentsActions.set(data));
    };

    fetchCarriers(
      {
        url: `/getcarriers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          c_status: "dangling_appointment",
          company: selectedCompany.value,
        },
      },
      transformData
    );
    fetchSalesmen(
      {
        url: `/getusers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          department: "sales",
          designation: "employee",
          company: selectedCompany.value,
        },
      },
      setSalesmen
    );
  }, [fetchSalesmen, fetchCarriers, dispatch, selectedCompany]);

  const assignAllHandler = () => {
    //   TODO make request to assign all carriers to selected salesman
  }

  const freeAllDanglingAppointments = () => {
    //   TODO make request to free all dangling appointments
  }

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td className="link" onClick={() => history.push(`/carrierview/${item.mc_number}`)}>
        {item.mc_number}
      </td>
      <td>{item.company_name}</td>
      <td>{item.trucks.length}</td>
      <td>{item.salesman ? item.salesman.user_name : "N/A"}</td>
      <td>{item.updatedAt !== "N/A" ? moment(new Date(item.updatedAt)).fromNow() : "N/A"}</td>
      <td>
        <Button
          style={{ paddingLeft: "40px", paddingRight: "40px" }}
          onClick={() => {
            onAssign(item.mc_number, item.truck_number, index);
          }}
          disabled={buttonLoader || !selectedSalesman}
        >
          {buttonLoader === index && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
          Assign {selectedSalesman ? `to ${selectedSalesman.label}` : ""}
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
  } else if (appointments === null)
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "green" }}>No more appointments to show.</h2>
      </div>
    );

  return (
    <div>
      <Row className="justify-content-start align-items-end my-2">
        <Col md={4}>
          <div className="assign__text"> Select Salesman:</div>
          <MySelect
            isMulti={false}
            value={selectedSalesman}
            onChange={setSelectedSalesman}
            options={salesmen.map((item) => {
              return {
                label: item.user_name,
                value: item._id,
              };
            })}
          />
        </Col>
        <Col md={8} className="d-flex justify-content-between">
          <Button className="btn-success m-1" style={{ height: "40px" }} onClick={assignAllHandler} disabled={!selectedSalesman}>
            Assign {selectedSalesman ? `all to ${selectedSalesman.label}` : ""}
          </Button>
          <Button className="btn-warning m-1" style={{ height: "40px" }} onClick={freeAllDanglingAppointments} disabled={!selectedSalesman}>
            Free all these appointment for dialing
          </Button>
        </Col>
      </Row>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                key={Math.random()}
                // limit="10"
                headData={carrierTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={appointments}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;

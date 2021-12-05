import React, { useEffect, useState } from "react";
import Table from "../../components/table/Table";
// import TruckForm from "../Form/NewTruckForm";
// import Button from "../UI/Button";
import useHttp from "../../hooks/use-https";
import MySelect from "../../components/UI/MySelect";
import Loader from "react-loader-spinner";
import Button from "../../components/UI/Button";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { salesActions } from "../../store/sales";

const carrierTableHead = [
  "#",
  "MC",
  "Carrier Name",
  "Truck Number",
  "Trailer Type",
  "Sales Person",
  "",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const AssignSales = () => {
  // const [carriers, setCarriers] = useState([]);
  const { carriers } = useSelector((state) => state.sales);
  const dispatch = useDispatch();
  const [dispatchers, setDispatchers] = useState([]);
  const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();
  const { sendRequest: fetchDispatchers } = useHttp();
  // const dispatchRef = useRef();
  const [selectedDispatcher, setSelectedDispatcher] = useState([]);

  const { company:selectedCompany } = useSelector((state)=> state.user);

  const onAssign = async (mc, truckNumber) => {
    console.log(selectedDispatcher);
    if (selectedDispatcher.length === 0) return;

    const assignedDispatcher = dispatchers.find((item) => {
      return item.user_name === selectedDispatcher.value;
    });
    const response = await axios({
      url: `${process.env.REACT_APP_BACKEND_URL}/admin/assigndispatcher/${mc}/${truckNumber}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },

      data: {
        _id: assignedDispatcher._id,
        name: assignedDispatcher.user_name,
      },
    });
    console.log(response);
    const newCarriers = carriers.filter((item) => {
      return !(item.truck_number === truckNumber && item.mc_number === mc);
    });
    dispatch(salesActions.set(newCarriers));
  };
  useEffect(() => {
    const transformData = (data) => {
      dispatch(salesActions.setAndPrepare(data));
    };

    fetchCarriers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/getcarriers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          c_status: "registered",
          "trucks.t_status": "new",
          company:selectedCompany.value,
        },
      },
      transformData
    );
    const transformDispatch = (data) => {
      setDispatchers(data);
    };
    fetchDispatchers(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/getusers`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          department: "dispatch",
          company: selectedCompany.value,
        },
      },
      transformDispatch
    );
  }, [fetchDispatchers, fetchCarriers, dispatch,selectedCompany]);

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.mc_number}</td>
      <td>{item.company_name}</td>
      <td>{item.truck_number}</td>
      <td>{item.trailer_type}</td>
      <td>{item.salesman ? item.salesman : "N/A"}</td>
      <td>
        <Button
          buttonText="Assign"
          color="inherit"
          onClick={() => {
            onAssign(item.mc_number, item.truck_number);
          }}
          className="button__class assign"
          // disabled={!modalFormIsValid}
        />
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
      <h2> Carriers: </h2>
      <dev className="assign__sale__down">
        <dev className="assign__text"> ADD DISPATCHER:</dev>
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
      </dev>
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

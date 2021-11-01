import React, { useState, useEffect } from "react";
import EditButton from "../UI/EditButton";
import Table from "./Table";
import TruckForm from "../Form/NewTruckForm";
import Button from "../UI/Button";
import Modal from "../modals/MyModal";
import "./trucktable.css";
import { useSelector } from "react-redux";
import useHttp from "../../hooks/use-https";

const customerTableHead = [
  "#",
  "Truck Number",
  "Vin Number",
  "Trailer Type",
  "Carry Limit(lbs)",
  "Temp Restrictions",
  "Off Days",
  "Travel Region",
  "Trip Duration",
  "Drivers",
  "",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const TruckTable = (props) => {
  const { _id: currUserId } = useSelector((state) => state.user.user);

  const [truckModal, setTruckModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [truck, setTruck] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const { sendRequest: fetchTrucks } = useHttp();
  const { sendRequest: deleteTruck } = useHttp();
  const { setTrucks, mc } = props;
  useEffect(() => {
    const transformData = (data) => {
      setTrucks(data.trucks);
    };
    fetchTrucks(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/getcarrier`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          "salesman._id": currUserId,
          mc_number: mc,
        },
      },
      transformData
    );
  }, [fetchTrucks, mc, setTrucks, currUserId, refresh]);
  const truckModalHnadler = () => {
    setTruckModal(true);
  };
  const closeTruckModal = () => {
    console.log("close");
    setTruckModal(false);
  };

  const editModalHnadler = () => {
    setEditModal(true);
  };
  const closeEditModal = () => {
    console.log("close Edit Modal");
    setTruck();
    setEditModal(false);
  };

  const deleteTruckHandler = (truck_number) => {
    const transformData = (data) => {
      setTrucks(data.trucks);
      setRefresh((prev) => prev + 1);
    };
    deleteTruck(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/deletetruck/${mc}/${truck_number}`,
      },
      transformData
    );
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.truck_number ? item.truck_number : "NA"}</td>
      <td>{item.vin_number ? item.vin_number : "NA"}</td>
      <td>{item.trailer_type ? item.trailer_type : "NA"}</td>
      <td>{item.carry_limit ? `<${item.carry_limit}K` : "NA"}</td>
      <td>
        {item.temperature_restriction
          ? `> ${item.temperature_restriction} F`
          : "NA"}
      </td>
      <td>
        {item.off_days.length !== 0
          ? item.off_days.map((item) => `${item}, `)
          : "NA"}
      </td>
      <td>
        {item.region.length !== 0
          ? item.region.map((item) => `${item}, `)
          : "NA"}
      </td>
      <td>{item.trip_durration ? `${item.trip_durration} Days` : "NA"}</td>
      <td>
        {item.drivers ? item.drivers.map((item) => `${item.name}, `) : "NA"}
      </td>
      <td>
        <div className="edit__class">
          <EditButton
            type="edit"
            onClick={() => {
              setTruck(item);

              editModalHnadler();
            }}
          />
          <EditButton
            type="delete"
            onClick={() => {
              deleteTruckHandler(item.truck_number);
            }}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div style={{ left: "10%", position: "relative" }}>
      <h2> Trucks: </h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                // limit="10"
                key={Math.random()}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={props.trucks}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
            <div
              className="footer"
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={truckModalHnadler} buttonText="Add Truck" />
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={truckModal}
        heading="Add New Truck"
        onClose={closeTruckModal}
      >
        <TruckForm
          setRefresh={setRefresh}
          refresh={refresh}
          closeModal={closeTruckModal}
        />
      </Modal>

      <Modal show={editModal} heading="Edit Truck" onClose={closeEditModal}>
        <TruckForm
          setRefresh={setRefresh}
          refresh={refresh}
          closeModal={closeEditModal}
          defaultValue={truck}
        />
      </Modal>
    </div>
  );
};

export default TruckTable;

import React, { useState } from "react";
import EditButton from "../UI/EditButton";
import Table from "./Table";
import TruckForm from "../Form/NewTruckForm";
import Button from "../UI/Button";
import Modal from "../modals/MyModal";
import "./trucktable.css";
import useHttp from "../../hooks/use-https";

import truck_status_map from "../../assets/JsonData/truck_status_map.json";
import Badge from "../../components/badge/Badge";

const customerTableHead = [
  "#",
  "Truck Number",
  "Vin Number",
  "Trailer Type",
  "Truck Staus",
  "Actions",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const TruckTable = (props) => {
  const [truckModal, setTruckModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [truck, setTruck] = useState(null);
  const { sendRequest: deleteTruck } = useHttp();
  const { setTrucks, mc } = props;
  const truckModalHnadler = () => {
    setTruckModal(true);
  };
  const closeTruckModal = () => {
    setTruckModal(false);
  };

  const editModalHnadler = () => {
    setEditModal(true);
  };
  const closeEditModal = () => {
    setTruck(null);
    setEditModal(false);
  };

  const deleteTruckHandler = (truck_number) => {
    const transformData = (data) => {
      setTrucks((prev) =>
        prev.filter((item) => item.truck_number !== truck_number)
      );
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
      <td>
        <h6>
          <Badge
            type={truck_status_map[item.t_status]}
            content={item.t_status}
          />
        </h6>
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
        <TruckForm setTrucks={setTrucks} closeModal={closeTruckModal} />
      </Modal>

      <Modal show={editModal} heading="Edit Truck" onClose={closeEditModal}>
        <TruckForm
          setTrucks={setTrucks}
          closeModal={closeEditModal}
          defaultValue={truck}
        />
      </Modal>
    </div>
  );
};

export default TruckTable;

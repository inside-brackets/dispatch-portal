import React, { useState, useEffect } from "react";
import EditButton from "../UI/EditButton";
import Table from "./Table";
import TruckForm from "../Form/NewTruckForm";
import Modal from "../modals/MyModal";
import "./trucktable.css";
import useHttp from "../../hooks/use-https";
import TooltipCustom from "../../components/tooltip/TooltipCustom";
import truck_status_map from "../../assets/JsonData/truck_status_map.json";
import Badge from "../../components/badge/Badge";
import { useSelector } from "react-redux";
import { Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

  // reassign states
  const [selectedDispatcher, setSelectedDispatcher] = useState(null);
  const [dispatchers, setDispatchers] = useState([]);
  const { company } = useSelector((state) => state.user);
  //
  const { user } = useSelector((state) => state.user);
  const [truckModal, setTruckModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [truck, setTruck] = useState(null);
  const { sendRequest: deleteTruck } = useHttp();

  const { setTrucks, mc } = props;

  const [showReassingModal, setShowReassingModal] = useState(false);

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
    setEditModal(false);
    // setTruck(null);
  };

  const deleteTruckHandler = (truck_number) => {
    const transformData = (data) => {
      setTrucks((prev) =>
        prev.filter((item) => item.truck_number !== truck_number)
      );
    };
    deleteTruck(
      {
        url: `/deletetruck/${mc}/${truck_number}`,
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
          {user.department === "sales" ? (
            <div className="action_button_truck_wrapper">
        <Button className="action_button_truck" disabled={props.disabled}>
              <EditButton
                type="edit"
                onClick={() => {
                  setTruck(item);
                  editModalHnadler();
                }}
              />
               </Button>
              <Button className="action_button_truck" disabled={props.disabled}>
              <EditButton
                type="delete"
                onClick={() => {
                  deleteTruckHandler(item.truck_number);
                }}
              />
              </Button>
            </div>
          ) : user.department === "admin" && item.t_status !== "new" ? (
            <EditButton
              type="open"
              onClick={() => {
                setTruck(item);
                setShowReassingModal(true);
                history.push(`/carrierview/${mc}/${item.truck_number}`);
              }}
            />
          ) : (
            user.department === "admin" &&
            item.t_status === "new" && (
              <>
                <div className="actionbuttonWrapper">
                  <div data-tip data-for="viewTruck">
                    <EditButton
                      type="open"
                      onClick={() => {
                        setTruck(item);
                        setShowReassingModal(true);
                        history.push(`/carrierview/${mc}/${item.truck_number}`);
                      }}
                    />
                  </div>
                  <TooltipCustom
                    text="View Detail Page"
                    id="viewTruck"
                  ></TooltipCustom>
                  <div
                    style={{ paddingLeft: "20px" }}
                    data-tip
                    data-for="truckdelete"
                  >
                    <EditButton
                      type="delete"
                      onClick={() => {
                        deleteTruckHandler(item.truck_number);
                      }}
                    />
                  </div>
                  <TooltipCustom
                    text="Delete Truck"
                    id="truckdelete"
                    right="10"
                  ></TooltipCustom>
                </div>
              </>
            )
          )}
        </div>
      </td>
    </tr>
  );

  // reassign
  useEffect(() => {
    axios
      .post(
        `/getusers`,

        {
          department: "dispatch",
          company: company.value,
        }
      )
      .then(({ data }) => setDispatchers(data));
  }, [company]);
  const reassign = async () => {
    axios
      .put(`/updatetruck/${mc}/${truck.truck_number}`, {
        "trucks.$.dispatcher": selectedDispatcher.value,
      })
      .then((result) => {
        setTrucks(result.data.trucks);
        setShowReassingModal(false);
      });
  };
  // reassign end

  return (
    <div className="truck-detail">
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
              <Button onClick={truckModalHnadler}>Add Truck</Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={truckModal}
        size="lg"
        heading="Add New Truck"
        onClose={closeTruckModal}
        scroll="add-truck-scroll"
      >
        <TruckForm
          admin={user.department === "admin"}
          setTrucks={setTrucks}
          closeModal={closeTruckModal}
        />
      </Modal>

      <Modal
        size="lg"
        show={editModal}
        heading="Edit Truck"
        onClose={closeEditModal}
      >
        <TruckForm
          admin={user.department === "admin"}
          setTrucks={setTrucks}
          closeModal={closeEditModal}
          defaultValue={truck}
        />
      </Modal>
      <Modal
        show={showReassingModal}
        heading="Assigned Dispatcher"
        onClose={() => {
          setShowReassingModal(false);
        }}
      >
        {truck && (
          <Row>
            <Col>
              <Select
                options={dispatchers.map((item) => ({
                  label: item.user_name,
                  value: item._id,
                }))}
                value={selectedDispatcher}
                onChange={setSelectedDispatcher}
                isSearchable={true}
              />
            </Col>
            <Col>
              <Button
                variant="warning"
                onClick={reassign}
                disabled={truck.dispatcher?._id === selectedDispatcher?.value}
              >
                Change Dispatcher
              </Button>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default TruckTable;

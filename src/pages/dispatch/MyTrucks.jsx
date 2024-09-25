import React, { useEffect, useState, useRef } from "react";
import Loader from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import TruckCard from "../../components/cards/TruckCard";
import { Row } from "react-bootstrap";
import Select from "react-select";

const MyTrucks = () => {
  const { _id: currUserId } = useSelector((state) => state.user.user);
  const [carriersList, setCarriersList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(false);
  const [statusFilter, setStatusFilter] = useState([
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "New", value: "new" },
    { label: "Pending", value: "pending" },
  ]);
  const history = useHistory();
  const searchRef = useRef();
  const [searchedCarrier, setSearchedCarrier] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const transformData = async ({ data }) => {
      if (data === null) {
        return;
      }

      const myTrucks = [];
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].trucks.length; j++) {
          if (data[i].trucks[j].dispatcher) {
            if (data[i].trucks[j].dispatcher._id === currUserId) {
              myTrucks.push({
                mc_number: data[i].mc_number,
                trailer_type: data[i].trucks[j].trailer_type,
                truck_number: data[i].trucks[j].truck_number,
                company_name: data[i].company_name,
                driver: data[i].trucks[j].drivers[0].name,
                truck_status: data[i].trucks[j].t_status,
                appointment: data[i].appointment,
              });
            }
          }
        }
      }

      for (const index in myTrucks) {
        const truck = myTrucks[index];
        const { data } = await axios.post(`/getload`, {
          "carrier.mc_number": truck.mc_number,
          "carrier.truck_number": truck.truck_number,
        });
        if (data) {
          myTrucks[index]["next"] = data.drop.date;
          myTrucks[index]["out_of"] = data.drop.address;
          myTrucks[index]["load_status"] = data.l_status;
        }
        if (parseInt(index) === myTrucks.length - 1) {
          const [newTrucks, oldTrucks] = myTrucks.reduce(
            ([p, f], item) =>
              !item.load_status ? [[...p, item], f] : [p, [...f, item]],
            [[], []]
          );
          oldTrucks.sort((a, b) => {
            return new Date(a.next) - new Date(b.next);
          });

          setCarriersList(newTrucks.concat(oldTrucks));
          setSearchedCarrier(newTrucks.concat(oldTrucks));
          setIsLoading(false);
        }
      }
      if (myTrucks.length === 0) {
        setIsLoading(false);
      }
    };
    axios
      .post(`/getcarriers`, {
        "trucks.dispatcher": currUserId,
        c_status: "registered",
        "trucks.t_status": {
          $in: statusFilter.map((item) => item.value),
        },
      })
      .then(transformData)
      .catch((err) => {
        setHttpError(true);
        console.log(err);
      });
  }, [currUserId, statusFilter]);

  //search
  const search = (e) => {
    if (e.key === "Enter") {
      const searched = carriersList.filter((c) => {
        return c.mc_number === parseInt(searchRef.current.value);
      });
      if (searched.length !== 0) {
        setSearchedCarrier(searched);
      } else {
        setSearchedCarrier(carriersList);
      }
    }
  };

  if (!isLoading && httpError) {
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  } else if (carriersList === null && !isLoading)
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "orange" }}>No trucks assigned yet.</h2>
      </div>
    );
  return (
    <div className="row">
      <div className="row align-items-center mb-3">
        <div className="col-md-3">
          <label>Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="MC"
            icon="bx bx-search"
            ref={searchRef}
            onKeyDown={search}
          />
        </div>
        {/* form-select */}
        <div className="col-md-5">
          <label>Status</label>
          <Select
            // className=""
            isMulti
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "New", value: "new" },
              { label: "Pending", value: "pending" },
            ]}
          />
        </div>
      </div>
      {isLoading && !httpError ? (
        <div className="spreadsheet__loader">
          <Loader
            type="MutatingDots"
            color="#349eff"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <Row>
          {searchedCarrier
            .filter((truck) => truck.truck_status !== "inactive")
            .map((item, index) => (
              <div
                className="col-3 d-flex align-items-stretch"
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  history.push(`/trucks/${item.mc_number}/${item.truck_number}`)
                }
                key={index}
              >
                {<TruckCard item={item} />}
              </div>
            ))}
        </Row>
      )}
    </div>
  );
};

export default MyTrucks;

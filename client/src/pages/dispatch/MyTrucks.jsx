import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import TruckCard from "../../components/cards/TruckCard";

const MyTrucks = () => {
  const { _id: currUserId } = useSelector((state) => state.user.user);
  const [carriersList, setCarriersList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(false);

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
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/getload`,
          {
            "carrier.mc_number": truck.mc_number,
            "carrier.truck_number": truck.truck_number,
          }
        );
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
          setIsLoading(false);

          console.log("finished");
        }
      }
      if (myTrucks.length === 0) {
        setIsLoading(false);
      }
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getcarriers`, {
        "trucks.dispatcher._id": currUserId,
        c_status: "registered",
      })
      .then(transformData)
      .catch((err) => {
        setHttpError(true);
        console.log(err);
      });
  }, [currUserId]);

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
  } else if (carriersList === null)
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "orange" }}>No trucks assigned yet.</h2>
      </div>
    );
  console.log("carrier ", carriersList);
  return (
    <div className="row">
      {carriersList.map((item, index) => (
        <div className="col-4" key={index}>
          <Link to={`/trucks/${item.mc_number}/${item.truck_number}`}>
            {<TruckCard item={item} />}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MyTrucks;

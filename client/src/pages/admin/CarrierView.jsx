import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Card from "../../components/cards/Card";
import Input from "../../components/UI/MyInput";
import TruckTable from "../../components/table/TruckTable";
import TextArea from "../../components/UI/TextArea";
import Loader from "react-loader-spinner";
import BackButton from "../../components/UI/BackButton";
import MySelect from "../../components/UI/MySelect";
import axios from "axios";

const AppointmentDetail = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [trucks, setTrucks] = useState([]);

  const history = useHistory();
  const params = useParams();
  const [carrier, setCarrier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getcarrier`, {
        mc_number: params.mc,
      })
      .then(({ data }) => {
        console.log(data);
        if (data) {
          setCarrier(data);
          setTrucks(data.trucks);
          setSelectedPayment({
            label: data.payment_method,
            value: data.payment_method,
          });
        } else {
          setError(true);
        }
        setIsLoading(false);
      });
  }, [params.mc]);

  if (isLoading && !error) {
    return (
      <div className="spreadsheet__loader">
        <Loader type="TailSpin" color="#A9A9A9" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && error) {
    return (
      <div className="spreadsheet__loader">
        <h2 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h2>
      </div>
    );
  }

  console.log("trucks", trucks);
  return (
    <div className="row">
      <div className="col-10">
        <BackButton onClick={() => history.push("/searchcarrier")} />
        <Card title={carrier.company_name} className="appointment__detail">
          <div
            className="row"
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <div className="col-1">
              <h4>MC:</h4>
            </div>
            <div className="col-5">
              <h4>{carrier.mc_number}</h4>
            </div>
            <div className="col-2">
              <h4>Phone no:</h4>
            </div>
            <div className="col-4">
              <h5>{carrier.phone_number}</h5>
            </div>
          </div>
          <div
            className="row"
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <div className="col-1">
              <h4>Email:</h4>
            </div>
            <div className="col-5">
              <Input
                style={{ marginTop: "-10px" }}
                type="text"
                defaultValue={carrier.email}
              />
            </div>
            <div className="col-2">
              <h4>Address:</h4>
            </div>

            <div className="col-4">
              <h5>{carrier.address}</h5>
            </div>
          </div>
          <div className="row">
            <center>
              <div className="col-8">
                <TextArea
                  style={{ width: "500px" }}
                  placeholder="comment"
                  defaultValue={carrier.comment}
                />
              </div>
            </center>
          </div>
          {/* Carrier Details */}
          <div className="row">
            <div className="col-6">
              <h2>Carrier Details:</h2>

              <form action="">
                <Input
                  type="text"
                  label="Owner's Name:"
                  placeholder="Enter Name"
                  defaultValue={carrier.owner_name}
                />

                <Input
                  type="text"
                  label="*Tax ID:"
                  placeholder="Enter 16 Digit code"
                  defaultValue={carrier.tax_id_number}
                />
              </form>
            </div>
            <div
              className="col-6"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "50px",
              }}
            >
              <MySelect
                isMulti={false}
                value={selectedPayment}
                onChange={setSelectedPayment}
                label="Payment Method:"
                options={[
                  { label: "Factoring ", value: "factoring" },
                  { label: "Quickpay ", value: "quickpay" },
                  { label: "Standardpay ", value: "standardpay" },
                ]}
              />
              <Input
                type="number"
                label="*Dispatch Fee:"
                placeholder="Enter Fee"
                defaultValue={
                  carrier.dispatcher_fee ? carrier.dispatcher_fee : 0
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h2>*Insurance Details:</h2>
              <form action="">
                <Input
                  type="text"
                  label="Company's Name:"
                  placeholder="Enter name"
                  defaultValue={carrier.insurance && carrier.insurance.name}
                />
                <Input
                  type="text"
                  label="Address:"
                  placeholder="Enter Address"
                  defaultValue={carrier.insurance && carrier.insurance.address}
                />
                <Input
                  type="text"
                  label="Phone Number:"
                  placeholder="(000) 000-0000"
                  defaultValue={carrier.insurance && carrier.insurance.phone_no}
                />
                <Input
                  type="text"
                  label="Agent's Name:"
                  placeholder="Enter Agent's Name"
                  defaultValue={
                    carrier.insurance && carrier.insurance.agent_name
                  }
                />
                <Input
                  type="email"
                  label="Agents's Email:"
                  placeholder="Enter email"
                  defaultValue={
                    carrier.insurance && carrier.insurance.agent_email
                  }
                />
              </form>
            </div>
            {selectedPayment.value === "factoring" && (
              <div className="col-6">
                <h2>Factoring Details:</h2>
                <form action="">
                  <Input
                    type="text"
                    label="Company's Name:"
                    placeholder="Enter name"
                    defaultValue={carrier.factoring && carrier.factoring.name}
                  />
                  <Input
                    type="text"
                    label="Address:"
                    placeholder="Enter Address"
                    defaultValue={
                      carrier.factoring && carrier.factoring.address
                    }
                  />
                  <Input
                    type="text"
                    label="Phone Number:"
                    placeholder="(000) 000-0000"
                    defaultValue={
                      carrier.factoring && carrier.factoring.phone_no
                    }
                  />

                  <Input
                    type="text"
                    label="Agent's Name:"
                    placeholder="Enter Agent's Name"
                    defaultValue={
                      carrier.factoring && carrier.factoring.agent_name
                    }
                  />
                  <Input
                    type="text"
                    label="Agents's Email:"
                    placeholder="Enter email"
                    defaultValue={
                      carrier.factoring && carrier.factoring.agent_email
                    }
                  />
                </form>
              </div>
            )}
          </div>
        </Card>
        <TruckTable
          mc={carrier.mc_number}
          trucks={trucks}
          setTrucks={setTrucks}
        />
      </div>
    </div>
  );
};

export default AppointmentDetail;

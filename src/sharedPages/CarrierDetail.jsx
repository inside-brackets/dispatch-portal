import React, { useState } from "react";
import { Tab, Tabs, Card } from "react-bootstrap";
import CarrierDetails from "../components/sharedPages/carrierDetails/CarrierDetails";
import CarrierDocuments from "../components/sharedPages/carrierDetails/CarrierDocuments";
// import CarrierIssues from "../components/sharedPages/carrierDetails/CarrierIssues";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CStatus from "../assets/JsonData/status_map.json";
import Badge from "../components/badge/Badge";
import BackButton from "../components/UI/BackButton";
import axios from "axios";
import Loader from "react-loader-spinner";

const CarrierDetail = () => {
  const [key, setKey] = useState("details");
  const [carrierData, setCarrierData] = useState();
  const [carrier, setCarrier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory();
  const params = useParams();
  let location = useLocation();
  // console.log(location.search?.get('q'),"location==>")
  console.log(location.search, "location==>");

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    axios
      .post(`/getcarrier`, {
        mc_number: params.mc,
      })
      .then(({ data }) => {
        setIsLoading(false);
        if (data) {
          setCarrier(data);
        }
      });
  }, [params.mc]);

  useEffect(() => {
    let url = location.pathname?.slice(1).split("/")[0];
    let query = location.search?.split("=")[1];
    if (url === "carrierview" && query === "documents") {
      setKey("documents");
    } else if (url === "carrierview" && query === "issues") {
      setKey("issues");
    } else if (url === "carrierview") {
      setKey("details");
    }
  }, [location.pathname, location.search]);
  const onSelectHandler = (k) => {
    setKey(k);
    if (k === "documents") {
      history.replace(`/carrierview/${params.mc}?q=documents`);
    } else if (k === "issues") {
      history.replace(`/carrierview/${params.mc}?q=issues`);
    } else if (k === "details") {
      history.replace(`/carrierview/${params.mc}`);
    }
  };
  if (isLoading && !error) {
    return (
      <div className="spreadsheet__loader">
        <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
      </div>
    );
  } else if (!isLoading && error) {
    return (
      <div className="spreadsheet__loader">
        <h4 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h4>
      </div>
    );
  }
  return (
    <>
      <Card
        className="truck-detail-card"
        style={{
          border: "none",
        }}
      >
        <Card.Body>
          <BackButton onClick={() => history.goBack()} />
          <div className="carrier_badge_status">
            <Badge type={CStatus[carrier.c_status]} content={carrier.c_status} />
          </div>
          <h1 className="text-center">{carrier.company_name} </h1>
          <Tabs id="carrierView" activeKey={key} onSelect={onSelectHandler} justify style={{ marginTop: "29px" }}>
            <Tab eventKey="details" title="Carrier Detail">
              <CarrierDetails carrierData={carrierData} setCarrierData={setCarrierData} />
            </Tab>
            <Tab eventKey="documents" title="Documents">
              <CarrierDocuments carrierData={carrierData} setCarrierData={setCarrierData} />
            </Tab>
            <Tab eventKey="issues" title="Issues">
              <CarrierIssues />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
};

export default CarrierDetail;

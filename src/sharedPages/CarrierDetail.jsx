import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import CarrierDetails from "../components/sharedPages/carrierDetails/CarrierDetails";
import CarrierDocuments from "../components/sharedPages/carrierDetails/CarrierDocuments";
import CarrierIssues from "../components/sharedPages/carrierDetails/CarrierIssues";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";

const CarrierDetail = () => {
  const [key, setKey] = useState("details");
  const [carrierData, setCarrierData] = useState()
  const history = useHistory()
  const params = useParams()
  let location = useLocation();

  useEffect(() => {
    let url = location.pathname?.slice(1).split("/")[0]
    if (url === "carrierview") {
      setKey("details")
    } else if (url === "carrierdocument") {
      setKey("documents")
    }
  }, [location.pathname])
  const onSelectHandler = (k) => {
    setKey(k)
    if (k === "documents") {
      history.replace(`/carrierdocument/${params.mc}`);
    } else if (k === "details") {
      history.replace(`/carrierview/${params.mc}`);
    }
  }
  return (
    <Tabs
      id="carrierView"
      activeKey={key}
      onSelect={onSelectHandler}
      justify
    >
      <Tab eventKey="details" title="Carrier Detail">
        <CarrierDetails  carrierData={carrierData} setCarrierData={setCarrierData} />
      </Tab>
      <Tab eventKey="documents" title="Documents">
        <CarrierDocuments  carrierData={carrierData} setCarrierData={setCarrierData} />
      </Tab>
      <Tab eventKey="issues" title="Issues">
        <CarrierIssues />
      </Tab>
    </Tabs>
  );
};

export default CarrierDetail;

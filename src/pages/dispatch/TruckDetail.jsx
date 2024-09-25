import React, { useState } from "react";
import { Tab, Tabs,Card } from "react-bootstrap";
import CarrierDocuments from "../../components/sharedPages/carrierDetails/CarrierDocuments";
import CarrierIssues from "../../components/sharedPages/carrierDetails/CarrierIssues";
import { useParams, useHistory, useLocation} from "react-router-dom";
import { useEffect } from "react";
import BackButton from "../../components/UI/BackButton";
import axios from "axios";  
import TruckDetails from "../../components/pages/dispatch/TruckDetails";
import Loader from "react-loader-spinner"

const TruckDetail = () => {
  const [key, setKey] = useState("details");
  const [carrierData, setCarrierData] = useState()
  const [carrier, setCarrier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory()
  const params = useParams()
  const location = useLocation();
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
      }})},[params.mc])

  useEffect(() => {
    let url = location.pathname?.slice(1).split("/")[0]
    let query = location.search?.split("=")[1]
    if (url === "trucks" && query==="documents") {
      setKey("documents")
    } else  if (url === "trucks" && query==="issues") {
      setKey("issues")
    }else if (url === "trucks") {
      setKey("details")
    }
  }, [location.pathname,location.search])
  const onSelectHandler = (k) => {
    setKey(k)
    if (k === "documents") {
      history.replace(`/trucks/${params.mc}/${params.truck}?q=documents`);
    } else if (k === "issues") {
      history.replace(`/trucks/${params.mc}/${params.truck}?q=issues`);
    }else if (k === "details") {
      history.replace(`/trucks/${params.mc}/${params.truck}`);
    }
  }
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
            <h1 className="text-center">{carrier.company_name}</h1>
         <Tabs
      id="carrierView"
      activeKey={key}
      onSelect={onSelectHandler}
      justify
      style={{marginTop:"29px"}}
    >
      <Tab eventKey="details" title="Carrier Detail">
        <TruckDetails/>
      </Tab>
      <Tab eventKey="documents" title="Documents">
        <CarrierDocuments  carrierData={carrierData} setCarrierData={setCarrierData} />
      </Tab>
      <Tab eventKey="issues" title="Issues">
        <CarrierIssues />
      </Tab>
    </Tabs>
    </Card.Body>
    </Card>
  </>);
};

export default TruckDetail;

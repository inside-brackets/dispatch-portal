import { useState, useEffect } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { Button, Col, Row } from "react-bootstrap";
import InvoiceModal from "./modals/InvoiceModal";
import axios from "axios";

const GenerateInvoice = ({ truck_number, carrier, closeModal }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dispatcherFee, setDispatcherFee] = useState(0);
  const [load, setLoad] = useState([]);
  const [grossTotal, setGrossTotal] = useState(0);
  const [loadedMilesTotal, setLoadedMilesTotal] = useState(0);
  const [loads, setLoads] = useState("");
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/getloads`, {
        "carrier.mc_number": carrier.mc_number,
        "carrier.truck_number": truck_number,
      })
      .then((res) => setLoads(res.data))
      .catch((err) => console.log(err));
  }, [carrier.mc_number, truck_number]);
  const { dispatcher_fee } = carrier;

  const search = () => {
    const to = new Date(endDate);
    to.setDate(to.getDate() + 1);
    const filteredLoad = loads.filter((item) => {
      return (
        new Date(item.pick_up.date) >= new Date(startDate) &&
        new Date(item.pick_up.date) <= to
      );
    });

    setLoad(filteredLoad);

    const totalLoadedMiles = filteredLoad
      .filter((item) => item.l_status !== "canceled")
      .reduce((pre, item) => {
        return pre + item.miles;
      }, 0);
    setLoadedMilesTotal(totalLoadedMiles);
    const totalGross = filteredLoad
      .filter((item) => item.l_status !== "canceled")
      .reduce((pre, item) => {
        return pre + item.pay;
      }, 0);
    setGrossTotal(totalGross);
    if (dispatcher_fee <= 50) {
      setDispatcherFee((totalGross / 100) * dispatcher_fee);
    } else if (dispatcher_fee > 50 && dispatcher_fee <= 100) {
      setDispatcherFee(dispatcher_fee * parseInt(load.length));
    } else if (dispatcher_fee > 100) {
      setDispatcherFee(dispatcher_fee);
    }
  };
  // console.log("Generatew Inovice", loads);
  const handleSelection = (ranges) => {
    setStartDate(ranges.Selection.startDate);
    setEndDate(ranges.Selection.endDate);
  };

  const selectionDate = {
    startDate: startDate,
    endDate: endDate,
    key: "Selection",
  };

  return (
    <>
      <Row>
        <Col>
          {" "}
          <DateRangePicker
            ranges={[selectionDate]}
            //   minDate={new Date()}
            rangeColors={["#FD5861"]}
            onChange={handleSelection}
            fixedHeight={false}
          />
          <Col className="text-center">
            <Button
              style={{
                margin: "10px",
                paddingLeft: "100px",
                paddingRight: "100px",
              }}
              size="lg"
              onClick={search}
            >
              Generate
            </Button>
          </Col>
        </Col>
      </Row>
      <InvoiceModal
        startDate={startDate}
        endDate={endDate}
        carrier={carrier}
        truck_number={truck_number}
        load={load}
        totalLoads={loads}
        totalGross={grossTotal}
        totalLoadedMiles={loadedMilesTotal}
        dispatcherFee={dispatcherFee}
        closeModal={closeModal}
      />
    </>
  );
};

export default GenerateInvoice;

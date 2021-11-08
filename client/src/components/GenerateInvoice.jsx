import { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { Button, Col, Row } from "react-bootstrap";
import InvoiceModal from "./modals/InvoiceModal";

const GenerateInvoice = ({
  loads,
  truck_number,
  carrier,
  setModalHandler,
  closeModal,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dispatcherFee, setDispatcherFee] = useState(0);
  const [load, setLoad] = useState([]);
  const [grossTotal, setGrossTotal] = useState(0);
  const [loadedMilesTotal, setLoadedMilesTotal] = useState(0);
  const { dispatcher_fee } = carrier;
  console.log(carrier);
  const search = () => {
    console.log({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const filteredLoad = loads.filter((item) => {
      return (
        new Date(item.pick_up.date) >= new Date(startDate) &&
        new Date(item.pick_up.date) <= new Date(endDate)
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
      console.log("49", dispatcher_fee);
      setDispatcherFee((totalGross / 100) * dispatcher_fee);
    } else if (dispatcher_fee > 50 && dispatcher_fee <= 100) {
      console.log("50-100", dispatcher_fee);
      setDispatcherFee(dispatcher_fee * parseInt(load.length));
    } else if (dispatcher_fee > 100) {
      console.log("100+", dispatcher_fee);
      setDispatcherFee(dispatcher_fee);
    }
    console.log(totalLoadedMiles, totalGross);
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

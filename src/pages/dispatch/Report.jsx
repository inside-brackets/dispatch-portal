import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import ReactSelect from "react-select";
import CarrierReport from "../../components/CarrierReport";
import { searchLoads } from "../../utils/utils";
import { useParams } from "react-router-dom";

const Report = () => {
  const params = useParams();
  const user = useSelector((state) => state.user.user);
  const [carrier, setCarrier] = useState(null);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [truck, setTruck] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [load, setLoad] = useState();
  const [report, setReport] = useState(null);
  const [deadHeadData, setDeadHead] = useState();
  const [lineGraphData, setLineGraphData] = useState(null);
  const [barGraphData, setBarGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectionDate = {
    startDate: startDate,
    endDate: endDate,
    key: "Selection",
  };

  const handleSubmit = async (mc, truck_num, start_date, end_date) => {
    setLoading(true);
    const { data } = await axios.post(`/getloads`, {
      "carrier.mc_number": mc,
      "carrier.truck_number": truck_num,
    });
    const filteredLoads = searchLoads(
      start_date ? start_date : startDate,
      end_date ? end_date : endDate,
      data
    );
    setLoad(
      filteredLoads.filter(
        (l) => l.l_status === "delivered" || l.l_status === "canceled"
      )
    );

    const deadHead = [];
    let temp = {
      start: null,
      end: null,
    };
    filteredLoads
      .filter((item) => item.l_status === "delivered")
      .forEach((element, index) => {
        if (index === 0) {
          temp = { ...temp, start: element.drop.address };
        } else if (index === filteredLoads.length - 1) {
          temp = { ...temp, end: element.pick_up.address };
        } else {
          temp = { ...temp, end: element.pick_up.address };
          deadHead.push(temp);
          temp = { ...temp, start: element.drop.address };
        }
      });
    if (deadHead.length > 0) {
      axios
        .post(`/dispatch/distance-matrix`, {
          dh: deadHead,
        })
        .then((res) => setDeadHead(res.data.data))
        .catch((err) => console.log("api error", err));
    } else {
      setDeadHead([
        {
          distance: {
            text: "0 mi",
            value: 0,
          },
        },
      ]);
    }
    axios
      .post(`/dispatch/line-graph`, {
        mc,
        truck,
      })
      .then((res) => {
        const data = res.data.map((item) => {
          const date = new Date();
          date.setMonth(item.month - 1);
          return {
            ...item,
            month: date.toLocaleString("en-US", {
              month: "long",
            }),
          };
        });
        setLineGraphData(data.reverse());
        console.log("line graph data", data);
      })
      .catch((err) => console.log("api error", err));

    axios
      .post(`/dispatch/bar-graph`, {
        mc,
        truck,
      })
      .then((res) => {
        const data = res.data.map((item) => {
          const date = new Date();
          date.setMonth(item.month - 1);
          return {
            ...item,
            month: date.toLocaleString("en-US", {
              month: "long",
            }),
          };
        });
        setBarGraphData(data.reverse());
        console.log("bar graph data", data);
      })
      .catch((err) => console.log("api error", err));
    console.log("tep", temp);

    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      let body = { c_status: "registered" };
      if (user.department === "dispatch") {
        body = { ...body, "trucks.dispatcher": user._id };
      }

      const carriers = await axios.post(`/getcarriers`, body);
      setCarrier(carriers.data);

      if (params.id) {
        axios
          .get(`/dispatch/get-carrier-report/${params.id}`)
          .then((res) => {
            const { data } = res.data;
            console.log("report", data);
            setSelectedCarrier({
              label: data.carrier.mc_number,
              value: data.carrier.mc_number,
            });
            setReport(data);
            setTruck({ label: data.truck, value: data.truck });
            setStartDate(new Date(data.from));
            setEndDate(new Date(data.to));
            setLoad(data.loads);
            setDeadHead(data.deadHead);
            axios
              .post(`/dispatch/line-graph`, {
                mc: data.carrier.mc_number,
                truck: data.truck,
              })
              .then((res) => {
                const data = res.data.map((item) => {
                  const date = new Date();
                  date.setMonth(item.month - 1);
                  return {
                    ...item,
                    month: date.toLocaleString("en-US", {
                      month: "long",
                    }),
                  };
                });
                setLineGraphData(data.reverse());
                console.log("line graph data", data);
              })
              .catch((err) => console.log("api error", err));

            axios
              .post(`/dispatch/bar-graph`, {
                mc: data.carrier.mc_number,
                truck: data.truck,
              })
              .then((res) => {
                const data = res.data.map((item) => {
                  const date = new Date();
                  date.setMonth(item.month - 1);
                  return {
                    ...item,
                    month: date.toLocaleString("en-US", {
                      month: "long",
                    }),
                  };
                });
                setBarGraphData(data.reverse());
                console.log("bar graph data", data);
              })
              .catch((err) => console.log("api error", err));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    fetchData();
  }, [params.id, user._id, user.department]);

  const handleSelection = (ranges) => {
    setStartDate(ranges.Selection.startDate);
    setEndDate(ranges.Selection.endDate);
  };

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Row>
              <Col>
                {" "}
                <label>Select MC</label>
                <ReactSelect
                  value={selectedCarrier}
                  onChange={setSelectedCarrier}
                  options={
                    !params.id &&
                    carrier &&
                    carrier.map((carrier) => ({
                      label: carrier.mc_number,
                      value: carrier.mc_number,
                    }))
                  }
                />
              </Col>
              <Col>
                {" "}
                <label>Select Truck</label>
                <ReactSelect
                  value={truck}
                  onChange={setTruck}
                  options={
                    !params.id &&
                    selectedCarrier &&
                    carrier
                      .find(
                        (carrier) => carrier.mc_number === selectedCarrier.value
                      )
                      .trucks.map((truck) => ({
                        label: truck.truck_number,
                        value: truck.truck_number,
                      }))
                  }
                />
              </Col>
              <Col>
                <DateRangePicker
                  ranges={[selectionDate]}
                  //   minDate={new Date()}
                  showMonthAndYearPickers={false}
                  rangeColors={["#FD5861"]}
                  direction="horizontal"
                  onChange={handleSelection}
                  fixedHeight={false}
                />
              </Col>
              <Col>
                <Button
                  disabled={
                    !selectedCarrier ||
                    !truck ||
                    !startDate ||
                    !endDate ||
                    loading ||
                    params.id
                  }
                  onClick={() =>
                    handleSubmit(selectedCarrier.value, truck.truck_number)
                  }
                >
                  Submit
                </Button>
              </Col>
            </Row>
            <Row>
              {load &&
                carrier &&
                deadHeadData &&
                lineGraphData &&
                barGraphData && (
                  <CarrierReport
                    dispatcher={user}
                    load={load}
                    startDate={startDate}
                    endDate={endDate}
                    carrier={carrier.find(
                      (item) => item.mc_number === selectedCarrier.value
                    )}
                    truck={truck}
                    lineGraphData={lineGraphData}
                    barGraphData={barGraphData}
                    deadHead={deadHeadData}
                    defaultValue={report}
                  />
                )}
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Report;

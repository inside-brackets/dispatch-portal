import React from "react";
import Table from "../../components/table/Table";
import Clock from "react-live-clock";
import "moment-timezone";
import "react-moment";
const renderBody = (item, index) => (
  <tr key={index}>
    <td>{item.timezone}</td>
    <td>{item.time}</td>
  </tr>
);
const UsClock = () => {
  const timezoneList = [
    {
      timezone: "Eastern:",
      time: <Clock format={"HH:mm:ss A"} ticking={true} timezone={"US/Eastern"} />,
    },
    {
      timezone: "Central:",
      time: (
        <Clock format={"HH:mm:ss A"} ticking={true} timezone={"US/Central"} />
      ),
    },
    {
      timezone: "Mountain:",
      time: (
        <Clock format={"HH:mm:ss A"} ticking={true} timezone={"US/Mountain"} />
      ),
    },
    {
      timezone: "Pacific:",
      time: (
        <Clock format={"HH:mm:ss A"} ticking={true} timezone={"US/Pacific"} />
      ),
    },
  ];
  return (
              <div className="card us__clock">
            <div className="card__body">
              <div className="card__header card__text__center">
                <h3>US Clock</h3>
              </div>
              <Table
                overflowHidden={true}
                bodyData={timezoneList}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
          </div>
  );
};

export default UsClock;

import React from "react";
import Filters from "../../components/filters/Filters";
const Salary = () => {
  return (
    <>
      <Filters placeholder={"Description"} filter={{
        date_range: "date-range",
         status: [
          { label: "cancelled", value: "cancelled" },
          { label: "cleared ", value: "cleared" },
          { label: "pending ", value: "pending" },
        ],
        person: [
          { label: "okay", value: "okay" },
          { label: "okay ", value: "okay" },
          { label: "okay ", value: "okay" },
        ],
      }}

      />
    </>
  );
};

export default Salary;

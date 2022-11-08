import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import "./SalarySlots.css";

function SalarySlots({ user, editable }) {
  const [first, setFirst] = useState({});
  const [second, setSecond] = useState({});
  const [third, setThird] = useState({});

  useEffect(() => {
    setFirst({
      lower: user.dispatch_salary_slots.first.lower_bound,
      upper: user.dispatch_salary_slots.first.upper_bound,
      percent: user.dispatch_salary_slots.first.percentage,
    });
    setSecond({
      upper: user.dispatch_salary_slots.second.upper_bound,
      percent: user.dispatch_salary_slots.second.percentage,
    });
    setThird({
      upper: user.dispatch_salary_slots.third.upper_bound,
      percent: user.dispatch_salary_slots.third.percentage,
    });
  }, [user]);

  const handleFirstChange = (e) => {
    e.persist();
    if (e.currentTarget.id === "lower") {
      setFirst((prevState) => ({
        ...prevState,
        lower: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "upper") {
      setFirst((prevState) => ({
        ...prevState,
        upper: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "percent") {
      setFirst((prevState) => ({
        ...prevState,
        percent: Number(e.target.value),
      }));
    }
  };

  const handleSecondChange = (e) => {
    e.persist();
    if (e.currentTarget.id === "upper") {
      setSecond((prevState) => ({
        ...prevState,
        upper: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "percent") {
      setSecond((prevState) => ({
        ...prevState,
        percent: Number(e.target.value),
      }));
    }
  };

  const handleThirdChange = (e) => {
    e.persist();
    if (e.currentTarget.id === "upper") {
      setThird((prevState) => ({
        ...prevState,
        upper: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "percent") {
      setThird((prevState) => ({
        ...prevState,
        percent: Number(e.target.value),
      }));
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th className="text-center">No.</th>
          <th>Slot</th>
          <th className="text-center">Lower Bound</th>
          <th className="text-center">Upper Bound</th>
          <th className="text-center">Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-center">1</td>
          <td>First</td>
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="lower"
                value={first.lower ?? 0}
                onChange={handleFirstChange}
              />
            </td>
          ) : (
            <td className="text-center">{first.lower ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="upper"
                value={first.upper ?? 0}
                onChange={handleFirstChange}
              />
            </td>
          ) : (
            <td className="text-center">{first.upper ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="percent"
                value={first.percent ?? 0}
                onChange={handleFirstChange}
              />
            </td>
          ) : (
            <td className="text-center">{first.percent ?? "-"}%</td>
          )}
        </tr>
        <tr>
          <td className="text-center">2</td>
          <td>Second</td>
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="upper"
                value={first.upper ?? 0}
                onChange={handleFirstChange}
              />
            </td>
          ) : (
            <td className="text-center">{first.upper ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="upper"
                value={second.upper ?? 0}
                onChange={handleSecondChange}
              />
            </td>
          ) : (
            <td className="text-center">{second.upper ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="percent"
                value={second.percent ?? 0}
                onChange={handleSecondChange}
              />
            </td>
          ) : (
            <td className="text-center">{second.percent ?? "-"}%</td>
          )}
        </tr>
        <tr>
          <td className="text-center">3</td>
          <td>Third</td>
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="upper"
                value={second.upper ?? 0}
                onChange={handleSecondChange}
              />
            </td>
          ) : (
            <td className="text-center">{second.upper ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="upper"
                value={third.upper ?? 0}
                onChange={handleThirdChange}
              />
            </td>
          ) : (
            <td className="text-center">{third.upper ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="percent"
                value={third.percent ?? 0}
                onChange={handleThirdChange}
              />
            </td>
          ) : (
            <td className="text-center">{third.percent ?? "-"}%</td>
          )}
        </tr>
      </tbody>
    </Table>
  );
}

export default SalarySlots;

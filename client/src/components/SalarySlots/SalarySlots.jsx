import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import "./SalarySlots.css";

function SalarySlots({
  first,
  setFirst,
  second,
  setSecond,
  third,
  setThird,
  editable,
}) {
  const handleFirstChange = (e) => {
    e.persist();
    if (e.currentTarget.id === "lower") {
      setFirst((prevState) => ({
        ...prevState,
        lower_bound: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "upper") {
      setFirst((prevState) => ({
        ...prevState,
        upper_bound: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "percent") {
      setFirst((prevState) => ({
        ...prevState,
        percentage: Number(e.target.value),
      }));
    }
  };

  const handleSecondChange = (e) => {
    e.persist();
    if (e.currentTarget.id === "upper") {
      setSecond((prevState) => ({
        ...prevState,
        upper_bound: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "percent") {
      setSecond((prevState) => ({
        ...prevState,
        percentage: Number(e.target.value),
      }));
    }
  };

  const handleThirdChange = (e) => {
    e.persist();
    if (e.currentTarget.id === "upper") {
      setThird((prevState) => ({
        ...prevState,
        upper_bound: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "percent") {
      setThird((prevState) => ({
        ...prevState,
        percentage: Number(e.target.value),
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
                value={first.lower_bound ?? 0}
                onChange={handleFirstChange}
              />
            </td>
          ) : (
            <td className="text-center">{first.lower_bound ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="upper"
                value={first.upper_bound ?? 0}
                onChange={handleFirstChange}
              />
            </td>
          ) : (
            <td className="text-center">{first.upper_bound ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="percent"
                value={first.percentage ?? 0}
                onChange={handleFirstChange}
              />
            </td>
          ) : (
            <td className="text-center">{first.percentage ?? "-"}%</td>
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
                value={first.upper_bound ?? 0}
                onChange={handleFirstChange}
              />
            </td>
          ) : (
            <td className="text-center">{first.upper_bound ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="upper"
                value={second.upper_bound ?? 0}
                onChange={handleSecondChange}
              />
            </td>
          ) : (
            <td className="text-center">{second.upper_bound ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="percent"
                value={second.percentage ?? 0}
                onChange={handleSecondChange}
              />
            </td>
          ) : (
            <td className="text-center">{second.percentage ?? "-"}%</td>
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
                value={second.upper_bound ?? 0}
                onChange={handleSecondChange}
              />
            </td>
          ) : (
            <td className="text-center">{second.upper_bound ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="upper"
                value={third.upper_bound ?? 0}
                onChange={handleThirdChange}
              />
            </td>
          ) : (
            <td className="text-center">{third.upper_bound ?? "-"}</td>
          )}
          {editable ? (
            <td className="text-center">
              <input
                className="custom-input"
                id="percent"
                value={third.percentage ?? 0}
                onChange={handleThirdChange}
              />
            </td>
          ) : (
            <td className="text-center">{third.percentage ?? "-"}%</td>
          )}
        </tr>
      </tbody>
    </Table>
  );
}

export default SalarySlots;

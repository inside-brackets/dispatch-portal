import React from "react";
import { roundNumber } from "../../utils/utils";

function DispatchIncentive({
  gross,
  incentive,
  excRate,
  setExcRate,
  readOnly,
}) {
  return (
    <>
      <div className="dis-flex dis-row dis-between mar-b-2">
        <div className="dis-flex dis-col">
          <span className="txt-1 line-1 fon-med mar-b-1">Company Gross</span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={"$ " + gross}
          />
        </div>
        <div className="dis-flex dis-col">
          <span className="txt-1 line-1 fon-med mar-b-1">
            Dispatcher Cut ($)
          </span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={"$ " + incentive ?? 0}
          />
        </div>
        <div className="dis-flex dis-col">
          <span
            className={`txt-1 line-1 fon-med mar-b-1 ${
              readOnly ? "" : "txt-black"
            }`}
          >
            Exchange Rate
          </span>
          <input
            type="number"
            className={`w-200 h-36 p-0-1 border border-r-025 num-input ${
              readOnly ? "bg-smoke no-input" : ""
            }`}
            readOnly={readOnly}
            value={excRate.toString() ?? 0}
            onChange={(e) => {
              setExcRate(Number(e.target.value));
            }}
          />
        </div>
        <div className="dis-flex dis-col">
          <span className="txt-1 line-1 fon-med mar-b-1">
            Dispatcher Cut (PKR)
          </span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={"PKR " + roundNumber(incentive * Number(excRate)) ?? 0}
          />
        </div>
      </div>
    </>
  );
}

export default DispatchIncentive;

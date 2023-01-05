import React from "react";

function IncentiveDispatchSlots({ slot, cut, prev }) {
  return (
    <>
      <div className="dis-flex dis-row dis-between mar-b-1">
        <div className="dis-flex dis-col">
          <span className="txt-1 line-1 fon-med txt-black mar-b-1">
            Lower Range
          </span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={slot.lower_bound ?? prev.upper_bound}
          />
        </div>
        <div className="dis-flex dis-col">
          <span className="txt-1 line-1 fon-med mar-b-1">Upper Range</span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={slot.upper_bound ?? "-"}
          />
        </div>
        <div className="dis-flex dis-col">
          <span className="txt-1 line-1 fon-med mar-b-1">Percentage</span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={slot.percentage}
          />
        </div>
        <div className="dis-flex dis-col">
          <span className="txt-1 line-1 fon-med mar-b-1">Total</span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={cut}
          />
        </div>
      </div>
    </>
  );
}

export default IncentiveDispatchSlots;

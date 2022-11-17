import React, { useEffect, useRef } from "react";

function Adjustments({ adjustments, setAdjustments, error, setError }) {
  const lastDesc = useRef(null);

  useEffect(() => {
    if (error) {
      lastDesc.current.classList.remove("border");
      lastDesc.current.classList.add("border-2");
      lastDesc.current.focus();
    } else {
      if (lastDesc.current) {
        lastDesc.current.classList.remove("border-2");
        lastDesc.current.classList.add("border");
      }
    }
  }, [error]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...adjustments];
    list[index][name] = value;
    setAdjustments(list);
    setError(false);
  };

  return (
    <>
      {adjustments.length > 0 ? (
        <></>
      ) : (
        <div className="mar-b-1">
          <span className="txt-1 line-1 fon-med txt-grey">None</span>
        </div>
      )}
      {adjustments.map((x, i) => {
        return (
          <div className="mar-b-2 dis-flex dis-row" key={i}>
            <div className="w-100 dis-flex dis-row dis-center mar-r-075">
              <span className="mar-r-075 txt-125 line-1 fon-med txt-black">
                Description:
              </span>
              <input
                className="w-100 h-36 p-0-1 border border-r-025 txt-875"
                name="desc"
                value={x.desc}
                ref={lastDesc}
                onChange={(e) => handleChange(e, i)}
              />
            </div>
            <div className="dis-flex dis-row dis-center">
              <span className="mar-r-075 txt-125 line-1 fon-med txt-black">
                Amount:
              </span>
              <div>
                <label className="pos-abs custom-lbl txt-1 line-1 txt-black">
                  PKR
                </label>
                <input
                  type="number"
                  className="w-200 h-36 p-l-4 border border-r-025"
                  name="amount"
                  value={x.amount}
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Adjustments;

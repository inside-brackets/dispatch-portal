import React, { useEffect, useRef } from "react";

function Adjustments({ adjustments, setAdjustments, error, setError }) {
  const lastDesc = useRef(null);
  const lastAmount = useRef(null);

  useEffect(() => {
    if (error) {
      if (lastDesc.current.value == "") {
        lastDesc.current.classList.remove("border");
        lastDesc.current.classList.add("border-2");
        lastDesc.current.focus();
      } else {
        lastAmount.current.focus();
      }
      if (lastAmount.current.value == "") {
        lastAmount.current.classList.remove("border");
        lastAmount.current.classList.add("border-2");
      }
    } else {
      if (lastDesc.current) {
        lastDesc.current.classList.remove("border-2");
        lastDesc.current.classList.add("border");
        lastAmount.current.classList.remove("border-2");
        lastAmount.current.classList.add("border");
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

  const handleRemove = (e, index) => {
    const list = [...adjustments];
    list.splice(index, 1);
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
              <span className="mar-r-075 txt-1 line-1 fon-med txt-black">
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
              <span className="mar-r-075 txt-1 line-1 fon-med txt-black">
                Amount:
              </span>
              <div>
                <label className="pos-abs custom-lbl txt-1 line-1 txt-black">
                  PKR
                </label>
                <input
                  type="number"
                  className="w-200 h-36 p-l-4 border border-r-025 num-input"
                  name="amount"
                  value={x.amount}
                  ref={lastAmount}
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
            </div>
            <div className="dis-flex dis-center p-l-1 cur-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                onClick={(e) => handleRemove(e, i)}
              >
                <path
                  d="M14.25,2.25a12,12,0,1,0,12,12A12,12,0,0,0,14.25,2.25Zm-2.117,8.578a.923.923,0,1,0-1.3,1.3l2.117,2.117-2.117,2.117a.923.923,0,1,0,1.3,1.3l2.117-2.117,2.117,2.117a.923.923,0,1,0,1.3-1.3L15.555,14.25l2.117-2.117a.923.923,0,1,0-1.3-1.3L14.25,12.945Z"
                  transform="translate(-2.25 -2.25)"
                  fill="#dc2626"
                  fill-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Adjustments;

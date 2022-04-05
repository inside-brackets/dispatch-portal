import React, { useEffect } from "react";

const Timer = () => {
  useEffect(() => {
    console.log("1st");

    let counter = JSON.parse(localStorage.getItem("counters"));
    const date = new Date().setHours(5, 0, 0);

    // if counter
    var timeOut;
    if (counter) {
      const now = new Date();
      const then = new Date(counter.date);
      then.setDate(then.getDate() + 1);
      timeOut = Math.max(then - now, 1000);
    } else {
      timeOut = 3000;
    }
    const timer = setTimeout(() => {
      // set Date today 5 pm and set count field to 0
      localStorage.setItem(
        "counters",
        JSON.stringify({
          counter: 0,
          date,
        })
      );
    }, timeOut);
    return () => clearTimeout(timer);
  }, []);

  return <></>;
};

export default Timer;

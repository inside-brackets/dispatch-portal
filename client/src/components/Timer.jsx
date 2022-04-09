import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Timer = () => {
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/sales/get-closet/${user?._id}`)
      .then((res) => {
        console.log(res.data);
        setTimeout(() => {
          axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/notification`, {
              user: res.data[0].salesman,
              msg: `Your Appointment with ${res.data[0].mc_number} is started now`,
            })
            .then((res) => toast.success("Your meeting starts now"))
            .catch((err) => console.log(err));
        }, res.data[0].difference);
      })
      .catch((err) => console.log(err));
    let counter = JSON.parse(localStorage.getItem("counters"));
    const date = new Date().setHours(17, 0, 0);

    // if counter
    var timeOut;
    if (counter) {
      const now = new Date();
      const then = new Date(counter.date);
      // then.setDate(then.getDate());
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

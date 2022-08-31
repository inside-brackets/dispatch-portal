import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Timer = () => {
  const { user } = useSelector((state) => state.user);
  const { value } = useSelector((state) => state.appointment);

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
     
      console.log("im run")
  }, [value,user?._id]);

  return <></>;
};

export default Timer;

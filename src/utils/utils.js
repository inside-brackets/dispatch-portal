import axios from "axios";

export const transformToSelectValue = (value) => {
  if (value.constructor === Array) {
    return value.map((item) => ({
      label: `${item.charAt(0).toUpperCase() + item.slice(1)} `,
      value: item.trim(),
    }));
  } else {
    return {
      label: `${value.charAt(0).toUpperCase() + value.slice(1)} `,
      value: value.trim(),
    };
  }
};

export const searchLoads = (startDate, endDate, loads) => {
  const to = new Date(endDate);
  to.setDate(to.getDate() + 1);
  const filteredLoad = loads.filter((item) => {
    return (
      new Date(item.pick_up.date) >= new Date(startDate) &&
      new Date(item.pick_up.date) <= to
    );
  });

  return filteredLoad;
};

export const getRefreshToken = async (id) => {
  const res = await axios.get(`/refreshToken/${id}`);
  localStorage.setItem("user", res.data);
};

export const roundNumber = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

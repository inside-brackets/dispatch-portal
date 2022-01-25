import axios from "axios";

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("user");
axios.defaults.headers.post["Content-Type"] = "application/json";
const httpIntercept = (props) => {
  axios.interceptors.request.use(
    (request) => {
      // Edit request config
      return request;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      // Edit response config
      return response;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );
};

export default httpIntercept;

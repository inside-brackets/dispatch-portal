import axios from "axios";
import Cookies from "universal-cookie";
import ENV from "../constants";
const cookies = new Cookies();

const httpIntercept = (props) => {
  axios.interceptors.request.use(
    (request) => {
      if (!request.url.includes("http")) {
        var baseURL = "";

        if (
          process.env.REACT_APP_DEV === "true" ||
          !process.env.REACT_APP_DEV
        ) {
          baseURL = process.env.REACT_APP_BACKEND_URL + request.url;
        } else {
          baseURL = ENV.backend_base_url + request.url;
        }

        request.url = baseURL;
        request.headers.common["x-auth-token"] = cookies.get("user");
      }
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      // Edit response config
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default httpIntercept;

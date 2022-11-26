import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const httpIntercept = (props) => {
  axios.interceptors.request.use(
    (request) => {
      if (!request.url.includes("http")) {
        var baseURL = "";

        if (process.env.REACT_APP_DEV === "true") {
          baseURL = process.env.REACT_APP_BACKEND_URL + request.url;
        } else {
          baseURL = document.baseURI + "api" + request.url;
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

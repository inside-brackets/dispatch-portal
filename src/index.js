import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { io } from "socket.io-client";
import ENV from "./constants";
let socket
if(process.env.REACT_APP_DEV==="true"){
  socket = io(process.env.REACT_APP_BACKEND_URL);
}else{
 socket = io(ENV.backend_base_url);
}

 const initiateSocket = (room) => {
  if(process.env.REACT_APP_DEV==="true"){
    socket = io(process.env.REACT_APP_BACKEND_URL);
  }else{
   socket = io(ENV.backend_base_url);
  }
  console.log(`Connecting socket...`);
  if (socket && room) socket.emit('join', room);
}

document.title = "Dispatch Portal";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

export { socket,initiateSocket };

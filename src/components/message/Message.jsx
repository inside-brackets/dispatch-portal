import "./message.css";
// import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
        <div className="nameMessageWrapper">
        <p className="personName">rehman</p>
        <p className="messageText">
          {message.text}
        </p>
        </div>
      </div>
      <div className="messageBottom">
        3 days ago
        {/* {format(message.createdAt)} */}
        </div>
    </div>
  );
}

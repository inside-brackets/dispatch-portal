import "./message.css";
// import { format } from "timeago.js";

export default function Message({ message }) {
  return (
    <div className="message">
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
       <div className="nameContentWrapper">
        <div className="messageBottom">
          <div className="personName">rehman</div>
          <div className="messageTime"> 3 days ago</div>
            {/* {format(message.createdAt)} */}
        </div>
        <div className="nameMessageWrapper">
        <p className="messageText">
          {message.text}
        </p>
        </div>
        </div>
      </div>

    </div>
  );
}

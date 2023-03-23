import "./message.css";
import { format } from "timeago.js";
import avatar from "../../assets//images/taut.png"

export default function Message({ message }) {
  return (
    <div className="message">
      <div className="messageTop">
        <img
          className="messageImg"
          src={message?.sender?.profile_image ?? avatar}
          alt=""
        />
       <div className="nameContentWrapper">
        <div className="messageBottom">
          <div className="personName">{message?.sender?.user_name}</div>
          <div className="messageTime">{format(message?.timestamp)}</div>
            {/* {format(message.createdAt)} */}
        </div>
        <div className="nameMessageWrapper">
        <p className="messageText">
          {message?.message}
        </p>
        </div>
        <div className="messageAttachments">
        {message?.attachments?.map((item) => {
                          return (
                            <>
                              <div className="attachment_files_item_wrapper">
                                <div><a href={item.url}><i className="bx bx-import action-button issue_file_icon"></i></a></div>
                                <div className="attachment_file_name">{item?.name.length > 20? item?.name.slice(0,13)+'...'+item?.name.slice(-6):item.name}</div>
                              </div>
                            </>
                          )
                        })}
        </div>
        </div>
      </div>

    </div>
  );
}

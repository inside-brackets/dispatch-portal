import React,{useState} from "react";
import { Alert, Card } from "react-bootstrap";
import DetailsLoginModal from "../detailLoginModal/DetailsLoginModal";
import "./lateLoginCard.css"

const LateLoginCard = ({
  headData,
  title,
  renderHead,
  data,
  renderBody,
}) => {
  const [show,setShow]=useState(false)
  return (
    <>
    <Card
      style={{
        width: "auto",
        height: "400px",
        border: "light",
      }}
    >
      <Card.Body>
      <Card.Title>
          <div className="late-comer-title-wrapper">
          <div>{title}</div>
          <div onClick={()=>{setShow(true)}} className="detail-Btn">Details</div>
          </div>
          </Card.Title>
        <hr />
        {!data || data.length === 0 ? (
          <Alert>Not Enough Data to show</Alert>
        ) : (
          <div className="tableFixHead">
            <table>
              <thead>
                <tr>
                  {headData.map((item, index) => renderHead(item, index))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => renderBody(item, index))}
              </tbody>
            </table>
          </div>
        )}
      </Card.Body>
    </Card>

<DetailsLoginModal
show={show}
onHide={() => setShow(false)}
// users={topUsers}
mSwitch={true}
/>
</>
  );
};

export default LateLoginCard;

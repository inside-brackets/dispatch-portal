import React from "react";
import { Card } from "react-bootstrap";

const DashboardUserCard = ({
  headData,
  title,
  renderHead,
  data,
  renderBody,
}) => {
  return (
    <Card
      style={{
        width: "auto",
        height: "480px",
        border: "light",
      }}
    >
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <hr />
        {!data || data.length === 0 ? (
          <>Not Enough Data to show</>
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
  );
};

export default DashboardUserCard;

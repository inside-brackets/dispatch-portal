import React from "react";
import { Alert, Card } from "react-bootstrap";

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
  );
};

export default DashboardUserCard;

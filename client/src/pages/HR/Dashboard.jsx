import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import MySelect from "../../components/UI/MySelect";
import { userActions } from "../../store/user";
import { themeActions } from "../../store/theme";
import { useSelector, useDispatch } from "react-redux";
import DashboardUserCard from "../../components/DashboardUserCard";
import axios from "axios";
import moment from "moment";
import StatusCard from "../../components/status-card/StatusCard";

const headData = ["#", "User Name", "Time"];
const renderHead = (item, index) => <th key={index}>{item}</th>;
const renderBody = (item, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>
      {item.candidate
        ? `${item.candidate.first_name} ${item.candidate.last_name}`
        : "NA"}
    </td>
    <td>{item.time ? moment(item.time).format("YYYY-MM-DD hh:mm A") : "NA"}</td>
  </tr>
);
const Dashboard = () => {
  // const notify = () => {
  //   socket.emit("notify", "test");
  // };
  const { company: selectedCompany } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([1, 2, 3, 4]);
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/interviews/get-table-interviews`,
        {
          filter: {
            status: [{ label: "scheduled", value: "scheduled" }],
            department: [],
          },
          limit: 100,
          skip: 0,
          start: moment(),
          end: moment().add("days", 2).format("YYYY-MM-DD"),
        }
      )
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/count-user/${selectedCompany.value}`
      )
      .then((res) => {
        const result = [
          {
            department: "HR",
            count: res.data
              .filter((item) => item._id.department === "HR")
              .reduce((pre, curr) => pre + curr.count, 0),
          },
          {
            department: "Accounts",
            count: res.data
              .filter((item) => item._id.department === "accounts")
              .reduce((pre, curr) => pre + curr.count, 0),
          },
          {
            department: "Sales",
            count: res.data.find(
              (item) =>
                item._id.department === "sales" &&
                item._id.company === selectedCompany.value
            ).count,
          },
          {
            department: "Dispatch",
            count: res.data.find(
              (item) =>
                item._id.department === "dispatch" &&
                item._id.company === selectedCompany.value
            ).count,
          },
          {
            department: "Joined this month",
            count: res.data.find(
              (item) => item._id.department === "Joined this month"
            ).count,
          },
          ,
          {
            department: "Upcoming resource",
            icon : "bx bx-user-check",
            count: res.data.find(
              (item) => item._id.department === "Upcoming Resource"
            ).count,
          },
          ,
          {
            department: "Pending Decision",
            count: res.data.find(
              (item) => item._id.department === "pending-decision"
            ).count,
          },
          ,
          {
            department: "Scheduled",
            count: res.data.find((item) => item._id.department === "scheduled")
              .count,
          },
        ];
        setUsers(result);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Row className="my-4">
        <Col md={4}>
          <MySelect
            isMulti={false}
            value={selectedCompany}
            onChange={(option) => {
              dispatch(userActions.changeCompany(option));
              var color =
                option.value === "elite"
                  ? "theme-color-blue"
                  : "theme-color-red";
              dispatch(themeActions.setColor(color));
              localStorage.setItem("selectedCompany", JSON.stringify(option));
            }}
            options={[
              {
                label: "Elite Dispatch Service",
                value: "elite",
              },
              {
                label: "Alpha Dispatch Solution",
                value: "alpha",
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <DashboardUserCard
            title="user"
            headData={headData}
            renderHead={(item, index) => renderHead(item, index)}
            data={data}
            renderBody={(item, index) => renderBody(item, index)}
          />
        </Col>
        <Col>
          <Row>
            {users.map((user, index) => (
              <Col md={3}>
                <StatusCard
                  style={{ height: "163px" }}
                  key={index}
                  title={user.department ?? "loading"}
                  icon= {user.icon ?? "bx bx-line-chart"}
                  count={user.count ?? 0}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { Row, Col,Button } from "react-bootstrap";
import MySelect from "../../components/UI/MySelect";
import { userActions } from "../../store/user";
import { themeActions } from "../../store/theme";
import { useSelector, useDispatch } from "react-redux";
import DashboardUserCard from "../../components/DashboardUserCard";
import axios from "axios";
import moment from "moment";
import StatusCard from "../../components/status-card/StatusCard";
import DetailsLoginModal from "../../components/detailLoginModal/DetailsLoginModal";
import LateLoginCard from "../../components/lateLoginCard/LateLoginCard";

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
    <td>{item.time ? moment(item.time).format("hh:mm A") : "NA"}</td>
  </tr>
);
const Dashboard = () => {
  // const notify = () => {
  //   socket.emit("notify", "test");
  // };
  const { company: selectedCompany } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [lateUsers, setLateUsers] = useState([]);
  const [today, setToday] = useState(new Date());
  const [show, setShow] = useState(false);
  const [departmentalDistribution, setDepartmentalDistribution] = useState([
    { icon: "bx bxs-group" },
    { icon: "bx bx-id-card" },
    { icon: "" },
    { icon: "bx bxs-truck" },
  ]);
  const [interviewInsight, setInterviewInsight] = useState([
    { icon: "bx bx-user-check" },
    { icon: "bx bx-user-plus" },
    { icon: "bx bxs-hourglass" },
    { icon: "bx bx-calendar-plus" },
  ]);
  useEffect(() => {
    axios
      .post(`/interviews/get-table-interviews`, {
        filter: {
          status: [{ label: "scheduled", value: "scheduled" }],
          department: [],
        },
        limit: 100,
        skip: 0,
        start: moment(),
        end: moment().add("days", 2).format("YYYY-MM-DD"),
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
    axios
      .get(`/count-user/${selectedCompany.value}`)
      .then((res) => {
        const departmentalDistribution = [
          {
            department: "HR",
            icon: "bx bxs-group",
            count: res.data
              .filter((item) => item._id.department === "HR")
              .reduce((pre, curr) => pre + curr.count, 0),
          },
          {
            department: "Accounts",
            icon: "bx bx-id-card",
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
            )?.count,
          },
          {
            department: "Dispatch",
            icon: "bx bxs-truck",
            count: res.data.find(
              (item) =>
                item._id.department === "dispatch" &&
                item._id.company === selectedCompany.value
            )?.count,
          },
        ];
        const interviewIns = [
          {
            department: "Joined this month",
            icon: "bx bx-user-check",
            count: res.data.find(
              (item) => item._id.department === "Joined this month"
            )?.count,
          },
          {
            department: "Upcoming resource",
            icon: "bx bx-user-plus",
            count: res.data.find(
              (item) => item._id.department === "Upcoming Resource"
            )?.count,
          },
          {
            department: "Pending Decision",
            icon: "bx bxs-hourglass",
            count: res.data.find(
              (item) => item._id.department === "pending-decision"
            )?.count,
          },
          {
            department: "Scheduled",
            icon: "bx bx-calendar-plus",
            count: res.data.find((item) => item._id.department === "scheduled")
              ?.count,
          },
        ];
        setDepartmentalDistribution(departmentalDistribution);
        setInterviewInsight(interviewIns);
      })
      .catch((err) => console.error(err));
  }, [selectedCompany.value]);

  const headDataLate = [
 "Name",
 "Department",
 "Late"
  ];
  
  const renderHeadLate = (item, index) => <th key={index}>{item}</th>;
let sales,dispatcher
  useEffect(async()=>{
    await axios.get(`/settings/timelogin`).then(({ data }) => {
      data.map((data) =>{
        if(data.department==="sales"){
          sales = data.loginTime
          // setSalesTime(data.loginTime)
        }else if(data.department==="dispatcher"){
          dispatcher=data.loginTime
          // setDispatchTime(data.loginTime)
        }
      })
  
    })
    axios.post('/logintime/getlogins',{
      sales:sales,
      dispatcher:dispatcher,
      month:today.getMonth(),
    }).then((res) => {
      setLateUsers(res.data.splice(0,5).sort((a, b) => b.late - a.late))
   })
  },[])
  const renderBodyLate = (item, index) => (
      <tr key={index}>
      <td>{item?.user_name[0].length>10?item?.user_name[0].slice(0,16):item?.user_name[0]}</td>
      <td>{item?.department[0]}</td>
      <td>{item?.late}</td>
      </tr>
      )

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
                label:
                  process.env.REACT_APP_FALCON === "true"
                    ? "Elite Dispatch Service"
                    : "Company B",
                value: "elite",
              },
              {
                label:
                  process.env.REACT_APP_FALCON === "true"
                    ? "Alpha Dispatch Service"
                    : "Company A",
                value: "alpha",
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <DashboardUserCard
            title="Today's Interview"
            headData={headData}
            renderHead={(item, index) => renderHead(item, index)}
            data={data}
            renderBody={(item, index) => renderBody(item, index)}
          />
        </Col>
        {/*  */}
        <Col>
          <Row>
            <h2>Departmental Distribution</h2>
            {departmentalDistribution.map((user, index) => (
              <Col md={3}>
                <StatusCard
                  style={{ height: "163px" }}
                  key={index}
                  title={user.department ?? "loading"}
                  icon={user.icon ?? "bx bx-line-chart"}
                  count={user.count ?? 0}
                />
              </Col>
            ))}
          </Row>
          <Row>
            <h2>Interview Insight</h2>
            {interviewInsight.map((user, index) => (
              <Col md={3}>
                <StatusCard
                  style={{ height: "163px" }}
                  key={index}
                  title={user.department ?? "loading"}
                  icon={user.icon ?? "bx bx-line-chart"}
                  count={user.count ?? 0}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row>
      <Col md={4}>
          <LateLoginCard
            title="Late-Comer"
            headData={headDataLate}
            renderHead={(item, index) => renderHeadLate(item, index)}
            data={lateUsers}
            renderBody={(item, index) => renderBodyLate(item, index)}
          />
        </Col>
      </Row>

      <DetailsLoginModal
        show={show}
        onHide={() => setShow(false)}
      />
    </>
  );
};

export default Dashboard;

import React from "react";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Line,
  BarChart,
  Bar,
} from "recharts";

const DonutGraphs = (props) => {
  const COLORS = ["#00FF00", "#FF0000", "#FFFF00"];

  const data = [
    { name: "Loaded Miles", value: props.loadedMiles },
    { name: "Deadhead", value: props.deadHeadMiles },
  ];
  if(props.loadedMiles === 0 && props.deadHeadMiles === 0){
    return <p>not enough data to show</p>
  }


  function CustomLabel({ viewBox, value1, value2 }) {
    const { cx, cy } = viewBox;
    const sum = value1.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.value;
    }, 0);
    return (
      <text
        x={cx}
        y={cy}
        fill="#3d405c"
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan alignmentBaseline="middle" fontSize="26">
          {sum}
        </tspan>
        <br />
        <tspan fontSize="14">{value2}</tspan>
      </text>
    );
  }
  return (
    <>
      {" "}
      <PieChart width={300} height={400}>
        <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            width={30}
            position="center"
            content={<CustomLabel value1={data} value2="Total" />}
          ></Label>
        </Pie>
        <Tooltip />
        <Legend align="left" />
      </PieChart>
    </>
  );
};

const LineGraph = (props) => {
if(props.data.length < 3){
  return <p>not enough data to show</p>
}  

  return (
    <>
      {" "}
      <LineChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="total_pay"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="total_miles" stroke="#82ca9d" />
      </LineChart>
    </>
  );
};

const BarGraph = (props) => {
  if(props.data.length < 3){
    return <p>not enough data to show</p>
  }
  return (
    <BarChart
    width={500}
    height={300}
    data={props.data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
    barSize={20}
  >
    <XAxis dataKey="month" scale="point" padding={{ left: 10, right: 10 }} />
    <YAxis />
    <Tooltip />
    <Legend />
    <CartesianGrid strokeDasharray="3 3" />
    <Bar dataKey="total" fill="#8884d8" background={{ fill: '#eee' }} />
  </BarChart>
  );
};

const Graphs = (props) => {
  return (
    <>
      {props.type === "donut" ? (
        <DonutGraphs {...props} />
      ) : props.type === "line" ? (
        <LineGraph {...props} />
      ) : props.type === "bar" ? (
        <BarGraph {...props} />
      ) : (
        <h1>Please specify type</h1>
      )}
    </>
  );
};
export default Graphs;

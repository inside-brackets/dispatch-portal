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
  ResponsiveContainer,
} from "recharts";

const DonutGraphs = (props) => {
  const COLORS = ["#00FF00", "#FF0000", "#FFFF00"];

  const data = [
    { name: "Loaded Miles", value: props.loadedMiles },
    { name: "Deadhead", value: props.deadHeadMiles },
  ];
  const lineChartData = [
    {
      name: "January",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Febuary",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "March",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "April",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "May",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "June",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "July",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

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
      {/* <LineChart
          width={500}
          height={300}
          data={lineChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart> */}
    </>
  );
};

const LineGraph = (props) => {
  const lineChartData = [
    {
      name: "January",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Febuary",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "March",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "April",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "May",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "June",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "July",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <>
      {" "}
      <LineChart
        width={500}
        height={300}
        data={lineChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </>
  );
};

const BarGraph = (props) => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (

    <BarChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
    barSize={20}
  >
    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
    <YAxis />
    <Tooltip />
    <Legend />
    <CartesianGrid strokeDasharray="3 3" />
    <Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eee' }} />
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

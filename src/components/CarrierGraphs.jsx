import React from "react";
import { Alert } from "react-bootstrap";
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
  // if(props.loadedMiles === 0 && props.deadHeadMiles === 0){
  //   return <p>not enough data to show</p>
  // }
  const data2 = [
    { name: "Loaded Miles", value: 50 },
    { name: "Deadhead", value: 50 },
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
  const renderLegend = (props) => {
    const { payload } = props;
    if(props.loadedMiles === 0 && props.deadHeadMiles === 0){
      return  <Alert variant="danger" className="text-center w-65">Not Enough data to show</Alert>
    }
    return (
      <div className="d-flex ">
        {
          payload.map((entry, index) => (
            
            <li style={{
              color:entry.color
            }} className="m-1" key={`item-${index}`}>{entry.value}</li>
          ))
        }
      </div>
    );
  }
  return (
    <>
      {" "}
      <PieChart style={{
        left:'170px'
      }} width={400} height={400}>
        <Pie
        data={props.loadedMiles === 0 && props.deadHeadMiles === 0 ? data2 : data}
          cx={120}
          cy={200}
          innerRadius={95}
          outerRadius={125}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            width={30}
            position="initial"
            content={<CustomLabel value1={data} value2="Total" />}
          ></Label>
        </Pie>
        <Tooltip />
         <Legend content={renderLegend}  />

      </PieChart>
      
 
    </>
  );
};

const LineGraph = (props) => {

const data2 = [
  {
    month: 'January',
    total_miles: 0,
    total_pay: 0,
    total: 0,
  },
  {
    month: 'Febuary',
    total_miles: 0,
    total_pay: 0,
    total: 0,
  },
  {
    month: 'March',
    total_miles: 0,
    total_pay: 0,
    total: 0,
  },
  {
    month: 'April',
    total_miles: 0,
    total_pay: 0,
    total: 0,
  },
  {
    month: 'May',
    total_miles: 0,
    total_pay: 0,
    total: 0,
  },
  {
    month: 'June',
    total_miles: 0,
    total_pay: 0,
    total: 0,
  },
  {
    month: 'July',
    total_miles: 0,
    total_pay: 0,
    total: 0,
  },
];

  return (
    <>
      {" "}
      <LineChart
        width={1000}
        height={300}
        data={props.data.length < 3 ? data2 : props.data}
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
        {props.data.length > 3  && <Legend />}        <Line
          type="monotone"
          dataKey="total_pay"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="total_miles" stroke="#82ca9d" />
      </LineChart>
      {props.data.length < 3 && <Alert variant="danger" className="text-center w-65">Not Enough data to show</Alert>}
    </>
  );
};

const BarGraph = (props) => {
  // if(props.data.length < 3){
  //   return <p>not enough data to show</p>
  // }

  const data2 = [
    {
      month: 'January',
      total_miles: 0,
      total_pay: 0,
      total: 0,
    },
    {
      month: 'Febuary',
      total_miles: 0,
      total_pay: 0,
      total: 0,
    },
    {
      month: 'March',
      total_miles: 0,
      total_pay: 0,
      total: 0,
    },
    {
      month: 'April',
      total_miles: 0,
      total_pay: 0,
      total: 0,
    },
    {
      month: 'May',
      total_miles: 0,
      total_pay: 0,
      total: 0,
    },
    {
      month: 'June',
      total_miles: 0,
      total_pay: 0,
      total: 0,
    },
    {
      month: 'July',
      total_miles: 0,
      total_pay: 0,
      total: 0,
    },
  ];
  return (
   <>
    <BarChart
    width={1000}
    height={300}
    data={props.data.length < 3 ? data2 : props.data}    margin={{
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
    {props.data.length > 3  && <Legend />}
    <CartesianGrid strokeDasharray="3 3" />
    <Bar dataKey="total" fill="#8884d8" background={{ fill: '#eee' }} />
  </BarChart>
  {props.data.length < 3 && <Alert variant="danger" className="text-center w-65">Not Enough data to show</Alert>}
    
  </>);
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

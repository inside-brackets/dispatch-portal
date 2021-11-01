import React, { useEffect, useState, useRef } from "react";
import Table from "../../components/table/Table";
// import TruckForm from "../Form/NewTruckForm";
// import Button from "../UI/Button";
import useHttp from "../../hooks/use-https";
import Badge from "../../components/badge/Badge";
import Input from "../../components/UI/MyInput";
import { Col, Row } from "react-bootstrap";
import MySelect from "../../components/UI/MySelect";
import Loader from "react-loader-spinner";

const loadTableHead = [
  "#",
  "Load Number",
  "Weight",
  "Miles",
  "Pay",
  "Dispatcher",
  "Broker",
  "Pick Up",
  "Drop",
];

const Loads = () => {
  return <div></div>;
};

export default Loads;

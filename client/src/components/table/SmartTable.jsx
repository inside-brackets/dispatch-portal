import axios from "axios";
import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import MySelect from "../UI/MySelect";
import "./table.css";
import { Row, Col } from "react-bootstrap";

const Table = (props) => {
  const [bodyData, setBodyData] = useState([]);
  const initDataShow =
    props.limit && bodyData ? bodyData.slice(0, Number(props.limit)) : bodyData;
  const [dataShow, setDataShow] = useState(initDataShow);
  const [filter, setFilter] = useState([]);
  const [currPage, setCurrPage] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  let pages = 1;
  let range = [];

  if (props.limit !== undefined) {
    let page = Math.floor(totalLength / Number(props.limit));
    pages = totalLength % Number(props.limit) === 0 ? page : page + 1;
    range = [...Array(pages).keys()];
  }
  props.api.body.skip = bodyData.length;
  props.api.body.limit = props.limit;

  useEffect(() => {
    getData();
  }, [search, filter, currPage]);

  useEffect(() => {
    const start = Number(props.limit) * currPage;
    const end = start + Number(props.limit);
    setDataShow(bodyData.slice(start, end));
  }, [bodyData, currPage]);

  const selectPage = (page) => {
    setCurrPage(page);
  };

  const searchData = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
      setBodyData([]);
      getData();
    }
  };

  const getData = () => {
    if (props.api) {
      if (bodyData.length === currPage * props.limit) {
        setLoading(true);
        if (filter && filter[0]?.label) {
          var status = filter.map((item) => item.value);
        }
        axios
          .post(
            `${props.api.url}/?status=${status}&search=${search}`,
            props.api.body
          )
          .then((res) => {
            console.log("loads", res.data);
            setBodyData((prevData) => [...prevData, ...res.data.data]);
            setTotalLength(res.data.length);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    }
  };
  return (
    <div>
      <Row>
        <Col md={3}>
          <MySelect
            isMulti={true}
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setBodyData([]);
              getData();
            }}
            label="Status"
            options={props.filter}
          />
        </Col>
        <Col style={{ marginTop: "3px" }} md={3}>
          <label>Search</label>
          <input
            type="text"
            placeholder={props.placeholder}
            className="form-control"
            icon="bx bx-search"
            onKeyDown={searchData}
          />
        </Col>
      </Row>
      <div
        className={`table-wrapper ${
          props.overflowHidden ? "overflow__hidden" : ""
        }`}
      >
        {loading ? (
          <div className="text-center">
            <Loader
              type="MutatingDots"
              color="#349eff"
              height={100}
              width={100}
            />
          </div>
        ) : (
          <table>
            {props.headData && props.renderHead ? (
              <thead>
                <tr>
                  {props.headData.map((item, index) =>
                    props.renderHead(item, index)
                  )}
                </tr>
              </thead>
            ) : null}

            {bodyData && props.renderBody ? (
              <tbody>
                {dataShow.map((item, index) => props.renderBody(item, index))}
              </tbody>
            ) : null}
          </table>
        )}
      </div>
      {pages > 1 ? (
        <div className="table__pagination">
          {range.map((item, index) => (
            <div
              key={index}
              className={`table__pagination-item ${
                currPage === index ? "active" : ""
              }`}
              onClick={() => selectPage(index)}
            >
              {item + 1}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Table;

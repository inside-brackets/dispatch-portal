import axios from "axios";
import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import "./table.css";
import { Row, Col, Form } from "react-bootstrap";

const Table = (props) => {
  const [bodyData, setBodyData] = useState({});
  console.log("odydata", bodyData);
  const [filter, setFilter] = useState(
    Object.keys(props.filter).reduce((pre, curr) => ((pre[curr] = []), pre), {})
  );
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
  props.api.body.skip = currPage * props.limit;
  props.api.body.limit = props.limit;

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [search, filter, currPage]);

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
  const filterData = (value, key) => {
    setFilter((oldValue) => {
      const temp = { ...oldValue };
      temp[key] = value;
      return temp;
    });
  };

  const getData = () => {
    if (!bodyData[`page${currPage}`]) {
      if (props.api) {
        setLoading(true);
        axios
          .post(`${props.api.url}/?search=${search}`, {
            ...props.api.body,
            filter,
          })
          .then((res) => {
            const pageKey = `page${currPage}`;
            setBodyData((prev) => {
              let temp = prev;
              temp[pageKey] = res.data.data;
              return temp;
            });
            setTotalLength(res.data.length);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    }
  };

  console.log("range", range);
  console.log("curr ", currPage);
  return (
    <div>
      <Row className="align-items-center">
        <Col md={3}>
          <label className="pb-2">Search</label>
          <input
            type="text"
            placeholder={props.placeholder}
            className="form-control mb-2"
            icon="bx bx-search"
            onKeyDown={searchData}
          />
        </Col>
        {Object.keys(props.filter).map((key, index) => {
          return (
            <Col md={3} className="mb-2">
              <Form.Label className="text-capitalize">{key}</Form.Label>
              <Select
                label={key}
                isMulti={true}
                value={filter[key]}
                onChange={(value) => {
                  // setFilter(value);
                  filterData(value, key);
                  setBodyData([]);
                  setCurrPage(0);
                  getData();
                }}
                options={props.filter[key]}
              />
            </Col>
          );
        })}
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
          <>
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
                  {bodyData[`page${currPage}`]?.map((item, index) =>
                    props.renderBody(item, index, currPage)
                  )}
                </tbody>
              ) : null}
            </table>
            {pages > 1 ? (
              <>
                <div className="table__pagination">
                  Showing {currPage * props.limit + 1} -{" "}
                  {!bodyData[`page${currPage}`]
                    ? null
                    : currPage * props.limit +
                      bodyData[`page${currPage}`].length}
                  &nbsp; of {totalLength} records &nbsp;
                  <button
                    className="table__pagination-item"
                    onClick={() => selectPage(0)}
                  >
                    {" "}
                    {`<<`}{" "}
                  </button>
                  <button
                    className="table__pagination-item"
                    onClick={() =>
                      selectPage(currPage === 0 ? currPage : currPage - 1)
                    }
                  >
                    {" "}
                    {`<`}{" "}
                  </button>
                  {/* {range.map((item, index) => (
                    <div
                      key={index}
                      className={`table__pagination-item ${
                        currPage === index ? "active" : ""
                      }`}
                      onClick={() => selectPage(index)}
                    >
                      {item + 1}
                    </div>
                  ))} */}
                  <button
                    className="table__pagination-item"
                    onClick={() =>
                      selectPage(
                        currPage === range.length - 1 ? currPage : currPage + 1
                      )
                    }
                  >
                    {`>`}
                  </button>
                  <button
                    className="table__pagination-item"
                    onClick={() => selectPage(range.length - 1)}
                  >
                    {" "}
                    {`>>`}{" "}
                  </button>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Table;

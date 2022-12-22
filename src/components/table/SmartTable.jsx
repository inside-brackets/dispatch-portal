import axios from "axios";
import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import "./table.css";
import { Row, Col, Form, Alert } from "react-bootstrap";

const Table = (props) => {
  const [bodyData, setBodyData] = useState({});
  const [filter, setFilter] = useState(
    Object.keys(props.filter).reduce((pre, curr) => ((pre[curr] = []), pre), {})
  );
  const [currPage, setCurrPage] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [sum, setSum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reRender, setReRender] = useState(false);
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
  }, [search, filter, currPage, endDate]);

  useEffect(() => {
    setBodyData([]);
    setReRender(true);
    setTimeout(() => {
      setReRender(false);
    }, 500);
    // eslint-disable-next-line
  }, [props.refresh]);

  useEffect(() => {
    if (reRender) {
      getData();
    }
    // eslint-disable-next-line
  }, [reRender]);

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
        console.log(props.api.body ,"...props.api.body",filter,"filter,",startDate,"startDate",endDate,"endDate")
        setLoading(true);
        axios
          .post(`${props.api.url}/?search=${search}`, {
            ...props.api.body,
            filter,
            start: startDate,
            end: endDate,
          })
          .then((res) => {
            const pageKey = `page${currPage}`;
            setBodyData((prev) => {
              let temp = prev;
              temp[pageKey] = res.data.data;
              return temp;
            });
            setTotalLength(res.data.length);
            setSum(res.data.total)
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    }
  };
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
          if (key === "date_range") {
            return (
              <>
                <Col md={3}>
                  <label>From</label>
                  <input
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                    className="form-control"
                  />
                </Col>
                <Col md={3}>
                  <label>To</label>
                  <input
                    disabled={!startDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setBodyData([]);
                      setCurrPage(0);
                      // getData();
                    }}
                    min={startDate}
                    type="date"
                    className="form-control"
                  />
                </Col>
              </>
            );
          }

          return (
            <>
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
                  // getData();
                }}
                options={props.filter[key]}
              />
            </Col>
            {props.total?
                      (<>
                      <Col md={4}></Col>
                      <Col md={2} className="mb-2">
                      <Form.Group>
                        <Form.Label className="text-capitalize">
                         {props.total }
                        </Form.Label>
                        <Form.Control
                        readOnly
                        type="number"
                        value={sum?sum:0}
                        >
          
                        </Form.Control>
                      </Form.Group>
                    </Col></>):null
        }
         </> );
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
                    props.renderBody(
                      item,
                      index + currPage * props.limit,
                      currPage
                    )
                  )}
                </tbody>
              ) : null}
            </table>
            {bodyData["page0"]?.length === 0 && (
              <Row className="justify-content-center">
                <Col md={6}>
                  <Alert
                    variant="danger"
                    className="text-center text-capitalize m-3"
                  >
                    No{" "}
                    {window.location.pathname
                      .replace("/", " ")
                      .replace("/", " ")
                      .replace("/", " ")
                      .replace(/[0-9]/g, "")}{" "}
                    to show
                  </Alert>
                </Col>
              </Row>
            )}
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

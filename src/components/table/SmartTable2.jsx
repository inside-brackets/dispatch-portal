import axios from "axios";
import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import "./table.css";
import { Row, Col, Form, Alert } from "react-bootstrap";

const Table = (props) => {
  const [bodyData, setBodyData] = useState({});
  const [currPage, setCurrPage] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [sum, setSum] = useState(0);
  const [loading, setLoading] = useState(false);
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
  }, [props.location, currPage]);

  const selectPage = (page) => {
    setCurrPage(page);
  };

  const getData = () => {
    const url = new URL(props.location || window.location.href);
    let query = url.search?.slice(1)?.split("&");
    let queryArr = query.map((item) => { return item.split("=") })
    let searchobj = {};
    for (let i = 0; i < queryArr.length; i++) {
      if (queryArr[i][0] === "search") {
        let search = queryArr[i][1]
        searchobj[queryArr[i][0]] = search
      } else if (queryArr[i][0] === "start") {
        let start = queryArr[i][1]
        searchobj[queryArr[i][0]] = start
      }
      else if (queryArr[i][0] === "end") {
        let end = queryArr[i][1]
        searchobj[queryArr[i][0]] = end
      }
      else {
        searchobj[queryArr[i][0]] = queryArr[i][1]?.split("%2C")
      }
    }
    if (!bodyData[`page${currPage}`]) {
      if (props.api) {
        setLoading(true);
        axios
          .post(`${props.api.url}`, {
            ...props.api.body,
            filter: searchobj,
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
        {props.total ?
          (<>
            <Col md={10}></Col>
            <Col md={2} className="mb-2">
              <Form.Group>
                <Form.Label className="text-capitalize">
                  Total
                </Form.Label>
                <Form.Control
                  readOnly
                  type="number"
                  value={sum ? sum : 0}
                >

                </Form.Control>
              </Form.Group>
            </Col></>) : null
        }
      </Row>
      <div
        className={`table-wrapper ${props.overflowHidden ? "overflow__hidden" : ""
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
                      .replace(/[0-9]/g, "")}
                    {" "}to show
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

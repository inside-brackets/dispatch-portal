import axios from "axios";
import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import MySelect from "../UI/MySelect";
import "./table.css";
import { Row, Col } from "react-bootstrap";

const Table = (props) => {
  const [bodyData, setBodyData] = useState({});
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
  props.api.body.skip = currPage * props.limit;
  props.api.body.limit = props.limit;

  useEffect(() => {
    getData();
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

  const getData = () => {
    if (!bodyData[`page${currPage}`]) {
      if (props.api) {
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
            console.log(err);
          });
      }
    }
  };
  return (
    <div>
      <Row className="align-items-center">
        <Col md={3} className="mb-2">
          <MySelect
            isMulti={true}
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setBodyData([]);
              setCurrPage(0);
              getData();
            }}
            label={
              props.status_placeholder ? props.status_placeholder : "Status:"
            }
            options={props.filter}
          />
        </Col>
        <Col className="mb-4 ms-5" md={3}>
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
                {bodyData[`page${currPage}`]?.map((item, index) =>
                  props.renderBody(item, index)
                )}
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

import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import EditButton from "../../components/UI/EditButton";
import Table from "../../components/table/SmartTable";
import MyModal from "../../components/modals/MyModal";
import ExpenseModal from "../../components/expenseModal/ExpenseModal";
import "../../assets/css/accounts/expenses.css"
import { toast } from "react-toastify";

const customerTableHead = [
  "#",
  "Amount",
  "Description",
  "Category",
  "Actions",
];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const PAGE_SIZE = 10;

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const [defaultValue, setDefaultValue] = useState(null);
  const [rerenderTable, setRerenderTable] = useState(null);
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });
  const defaultOptions = [  ];

  useEffect(async() => {
    let {data} = await axios.get('/accounts/expense/categories')
    data.map((category) =>{
        let value = createOption(category)
        defaultOptions.push(value)
    })
  })

  const deleteExpense =async (id)=>{
    try{
    await axios.delete(`/accounts/expense/${id}`)
    setRerenderTable(Math.random());
    toast.success("Expense deleted");
    }catch(err){
      toast.error(err.response?.data.msg ?? err.response.statusText);
    }
  }
  const renderBody = (item, index, currPage) =>  {
    console.log(item,"items")
 return (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.amount}</td>
      <td>{item.desc ?? "N/A"}</td>
      <td>{item.category}</td>
      <td>
      <div className="action_button_expenses_wrapper">
        <div    className="action_btn_expenses_delete">
      <EditButton
   
                type="delete"
                onClick={() => {
                  deleteExpense(item._id);
                }}
              />
              </div>
              <div  className="action_btn_expenses_edit"> 
        <EditButton
          type="edit"
          onClick={() => {
            setDefaultValue(item);
            setShowModal(true);
          }}
        />
        </div>
        </div>
      </td>
    </tr>
  )};
  var body = {};

  return (
    <Row>
      <Row className="m-3">
        <Col md={3}></Col>
        <Col md={5}></Col>
        <Col md={4}>
            <Button
              onClick={() => {
                setShowModal(true);
              }}
              style={{ float: "right" }}
            >
              Add Expense
            </Button>
        </Col>
      </Row>
      <div className="card">
        <div className="card__body">
          <Table
            key={rerenderTable}
            title="Expenses"
            limit={PAGE_SIZE}
            headData={customerTableHead}
            renderHead={(item, index) => renderHead(item, index)}
            api={{
              url: `/accounts/expense/getall`,
              body,
            }}
            placeholder={"Description"}
            filter={{
              category: defaultOptions
            }}
            renderBody={(item, index, currPage) =>
              renderBody(item, index, currPage)
            }
            total="Total"
            // renderExportData={(data) => renderExportData(data)}
            // exportData
          />
        </div>
      </div>
      <MyModal
        size="lg"
        show={showModal}
        heading={defaultValue?"Edit Expense":"Add Expense"}
        onClose={() => {
          setDefaultValue(null);
          setShowModal(false);
        }}
        style={{ width: "auto" }}
      >
        <ExpenseModal
          defaultValue={defaultValue}
          onSuccess={() => {
            setDefaultValue(null);
            setRerenderTable(Math.random());
            setShowModal(false);
          }}
        />
      </MyModal>
    </Row>
  );
};

export default Expenses;

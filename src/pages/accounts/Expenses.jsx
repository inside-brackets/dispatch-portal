import React, { useEffect, useState } from "react";
import { Row, Col, Button} from "react-bootstrap";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import EditButton from "../../components/UI/EditButton";
import Table from "../../components/table/SmartTable";
import MyModal from "../../components/modals/MyModal";
import ExpenseModal from "../../components/expenseModal/ExpenseModal";
import DeleteConfirmation from "../../components/modals/DeleteConfirmation";
import TooltipCustom from "../../components/tooltip/TooltipCustom";
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
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [deleteModal, setDeleteModal] = useState(false);
  const [expenseId,setExpenseId] = useState();

  const defaultOptions = [ ];
  useEffect(() => {
    async function fetchData(){
    let {data} = await axios.get('/accounts/expense/categories')
    data.map((category) =>{
        let value = createOption(category)
        defaultOptions.push(value)
    })
  }
  fetchData()
  },[])
  
  const getYears = () => {
    const YEAR = new Date().getFullYear();
    const STARTING_YEAR = 2022;
    const years = Array.from(
      new Array(YEAR - STARTING_YEAR + 1),
      (val, index) => index + STARTING_YEAR
    );
    return years;
  };
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const submitDeleteExpense = async () => {
    deleteExpense(expenseId);
    setDeleteModal(false)
      }
    const deleteExpenseBtn = (item)=>{
      setDeleteModal(true)
      setExpenseId(item)
      }

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });
 
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
 return (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.amount}</td>
      <td>{item.desc ?? "N/A"}</td>
      <td>{item.category}</td>
      <td>
      <div className="action_button_expenses_wrapper">
      <TooltipCustom
                          text="Delete Expense"
                          id="expenseDelete"
                        ></TooltipCustom>
        <div     className="action_btn_expenses_delete" data-tip data-for="expenseDelete">
      <EditButton
                 type="delete"
                 onClick={() => {
                 deleteExpenseBtn(item._id)
                  }}
              />
              </div>
              <TooltipCustom
                          text="Edit Expense"
                          id="expenseEdit"
                        ></TooltipCustom>
              <div  className="action_btn_expenses_edit" data-tip data-for="expenseEdit"> 
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
  var body = {
    month: month,
    year: year,
  };

  return (
    <Row>
      <Row className="card-Heaing-Wrapper mb-2">
        <Col md={2}>
        <Form.Group controlId="formBasicSelect" className="years-Wrapper">
        <Form.Label>Years</Form.Label>
        <Form.Control
          as="select"
          value={year}
          onChange={(e) =>{ setYear(e.target.value); setRerenderTable(Math.random())}}>
              {getYears().map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
        </Form.Control>
      </Form.Group>
        </Col>
        <Col md={2}>
        <Form.Group controlId="formBasicSelect">
        <Form.Label>Month</Form.Label>
        <Form.Control
          as="select"
          value={month}
          
          onChange={(e)=>{ setMonth(e.target.value); setRerenderTable(Math.random()) }}>
            {MONTHS.map((y, i) => (
              <option key={i} value={i}>
                {y}
              </option>
            ))}
        </Form.Control>
      </Form.Group>
        </Col>
        <Col md={4}></Col>
        <Col md={4} className="add-Expense-Btn">
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
      <DeleteConfirmation
                showModal={deleteModal}
                confirmModal={submitDeleteExpense}
                hideModal={() => setDeleteModal(false)}
                message={"Are you Sure to want to delete Expense?"}
                title="Delete Confirmation"
              />
    </Row>
  );
};

export default Expenses;

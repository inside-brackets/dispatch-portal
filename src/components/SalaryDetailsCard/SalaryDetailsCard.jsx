import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import "./SalaryDetailsCard.css";
import UserCard from "./UserCard";
import Adjustments from "./Adjustments";
import Incentives from "./Incentives";
import Slots from "./Slots";
import Invoices from "./Invoices";
import { roundNumber } from "../../utils/utils";

function SalaryDetailsCard({
  user,
  readOnly,
  setReadOnly,
  salary,
  year,
  month,
}) {
  const [error, setError] = useState(false);
  const [base, setBase] = useState(0);
  const [adjustments, setAdjustments] = useState([]);
  const [adjustment, setAdjustment] = useState(0);
  const [incentive, setIncentive] = useState(0);
  const [excRate, setExcRate] = useState(200);
  const [invoices, setInvoices] = useState([]);
  const [gross, setGross] = useState(0);
  const [slotOne, setSlotOne] = useState(0);
  const [slotTwo, setSlotTwo] = useState(0);
  const [slotThree, setSlotThree] = useState(0);

  const history = useHistory();

  useEffect(() => {
    if (!readOnly) {
      setBase(user.salary);
      if (user.department === "dispatch") {
        axios({
          method: "POST",
          url: `/salary/get/invoices`,
          headers: { "Content-Type": "application/json" },
          data: {
            dispatcher: user._id,
            year: year,
            month: month,
          },
        }).then(({ data }) => {
          setInvoices(data);
        });
      }
      if (user.department === "sales") {
        axios
          .get(`/salary/invoice/${year}/${month}/${user._id}`)
          .then(({ data }) => {
            setInvoices(data);
          });
      }
    }
  }, [year, month, user, readOnly]);

  useEffect(() => {
    if (salary) {
      setBase(salary.base);
      setAdjustments(salary.adjustment);
      setExcRate(salary.exchangeRate);
      setInvoices(salary.invoices);
    }
  }, [salary]);

  useEffect(() => {
    if (invoices && invoices.length > 0) {
      let total = 0;
      invoices.forEach((x, i) => {
        total += Number(x.dispatcherFee);
      });
      setGross(total);
    }
  }, [invoices]);

  useEffect(() => {
    let total = 0;
    adjustments.forEach((x, i) => {
      total += Number(x.amount);
    });
    setAdjustment(total);
  }, [adjustments]);

  useEffect(() => {
    if (user.department === "dispatch") {
      calculateIncentive();
    }
    if (user.department === "sales") {
      calculateSalesIncentive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, gross]);

  useEffect(() => {
    setIncentive(slotOne + slotTwo + slotThree);
  }, [slotOne, slotTwo, slotThree]);

  const calculateIncentive = () => {
    let firstDiff =
      user.dispatch_salary_slots.first.upper_bound -
      user.dispatch_salary_slots.first.lower_bound;
    let secondDiff =
      user.dispatch_salary_slots.second.upper_bound -
      user.dispatch_salary_slots.first.upper_bound;

    let temp = 0;

    if (gross <= user.dispatch_salary_slots.first.lower_bound) {
      setSlotOne(0);
      setSlotTwo(0);
      setSlotThree(0);
    } else {
      if (gross <= user.dispatch_salary_slots.first.upper_bound) {
        temp = gross - user.dispatch_salary_slots.first.lower_bound;
        temp = (user.dispatch_salary_slots.first.percentage / 100) * temp;
        setSlotOne(roundNumber(temp));
      } else {
        temp = firstDiff;
        temp = (user.dispatch_salary_slots.first.percentage / 100) * temp;
        setSlotOne(roundNumber(temp));

        if (gross <= user.dispatch_salary_slots.second.upper_bound) {
          temp =
            gross - firstDiff - user.dispatch_salary_slots.first.lower_bound;
          temp = (user.dispatch_salary_slots.second.percentage / 100) * temp;
          setSlotTwo(roundNumber(temp));
        } else {
          temp = secondDiff;
          temp = (user.dispatch_salary_slots.second.percentage / 100) * temp;
          setSlotTwo(roundNumber(temp));

          temp =
            gross -
            firstDiff -
            secondDiff -
            user.dispatch_salary_slots.first.lower_bound;
          temp = (user.dispatch_salary_slots.third.percentage / 100) * temp;
          setSlotThree(roundNumber(temp));
        }
      }
    }
  };

  const calculateSalesIncentive = () => {
    setIncentive(roundNumber(0.15 * gross));
  };

  const handleClick = () => {
    let check = true;
    if (adjustments.length >= 1) {
      if (
        adjustments[adjustments.length - 1].desc === "" ||
        adjustments[adjustments.length - 1].amount === ""
      ) {
        check = false;
      }
    }
    if (check) {
      setAdjustments([
        ...adjustments,
        {
          desc: "",
          amount: "",
        },
      ]);
    } else {
      setError(true);
    }
  };

  const paySalary = async () => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/salary/create/salary`,
      headers: { "Content-Type": "application/json" },
      data: {
        user: user._id,
        year: year,
        month: month,
        invoices: Array.from(invoices, (invoice) => {
          return invoice._id;
        }),
        adjustment: adjustments,
        incentivePKR: roundNumber(incentive * excRate),
        incentiveUSD: incentive,
        exchangeRate: excRate,
        base: base,
      },
    });
    setReadOnly(true);
    toast.success("Salary Paid!");
  };

  return (
    <Card className="p-32 border">
      <Card.Body className="p-0">
        {user && (
          <UserCard user={user} readOnly={readOnly} year={year} month={month} />
        )}
        <h1 className="txt-2 fon-bold mar-b-1">Overview</h1>
        <div className="mar-b-2 dis-flex dis-row dis-between">
          <div className="dis-flex dis-col">
            <span className="txt-1 line-1 fon-med mar-b-1">Base Salary</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value={"PKR " + base}
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-1 line-1 fon-med mar-b-1">Incentive</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value={"PKR " + roundNumber(incentive * excRate)}
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-1 line-1 fon-med mar-b-1">Adjustment</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value={"PKR " + adjustment}
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-1 line-1 fon-med mar-b-1">Total</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value={"PKR " + (base + incentive * Number(excRate) + adjustment)}
            />
          </div>
        </div>
        <div className="mar-b-1 dis-flex dis-row dis-bottom">
          <h1 className="mar-b-0 mar-r-15 txt-2 fon-bold">Adjustment</h1>
          {readOnly ? (
            <></>
          ) : (
            <span
              className="txt-875 fon-med custom-btn cur-pointer"
              onClick={handleClick}
            >
              Add+
            </span>
          )}
        </div>
        <Adjustments
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          error={error}
          setError={setError}
          readOnly={readOnly}
        />
        <h1 className="txt-2 fon-bold mar-b-1">Incentive</h1>
        {user &&
        (user.department === "dispatch" || user.department === "sales") ? (
          <>
            <Incentives
              gross={gross}
              incentive={incentive}
              excRate={excRate}
              setExcRate={setExcRate}
              readOnly={readOnly}
            />
            {user.department === "dispatch" ? (
              <>
                <hr />
                <h1 className="txt-2 fon-bold mar-b-1">Breakdown</h1>
                <div className="mar-b-2">
                  <h1 className="txt-125 fon-bold mar-b-1">Slot 1</h1>
                  {user && (
                    <Slots
                      slot={user.dispatch_salary_slots.first}
                      cut={slotOne}
                    />
                  )}
                  <h1 className="txt-125 fon-bold mar-b-1">Slot 2</h1>
                  {user && (
                    <Slots
                      slot={user.dispatch_salary_slots.second}
                      cut={slotTwo}
                    />
                  )}
                  <h1 className="txt-125 fon-bold mar-b-1">Slot 3</h1>
                  {user && (
                    <Slots
                      slot={user.dispatch_salary_slots.third}
                      cut={slotThree}
                    />
                  )}
                </div>
              </>
            ) : null}
            <hr />
            <h1 className="txt-2 fon-bold mar-b-1">Invoices</h1>
            {invoices && <Invoices invoices={invoices} />}
          </>
        ) : (
          <div className="mar-b-1">
            <span className="txt-1 line-1 fon-med txt-grey">None</span>
          </div>
        )}
        <hr />
        <div className="dis-flex dis-row dis-between">
          <Button
            type="view"
            variant="secondary"
            onClick={(e) => {
              history.push("/salaries");
            }}
          >
            {readOnly ? "Go Back" : "Cancel"}
          </Button>
          <Button
            type="view"
            variant="primary"
            disabled={readOnly}
            onClick={paySalary}
          >
            {readOnly ? "Paid" : "Pay"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SalaryDetailsCard;

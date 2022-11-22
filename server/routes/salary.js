const express = require("express");
const {
  updateSlots,
  createSalary,
  getSalaries,
} = require("../controllers/salary");
const { getInvoicesByRange } = require("../controllers/invoices");

const router = express.Router();

router.post("/update/slots/:id", updateSlots);
router.post("/create/salary", createSalary);
router.post("/get/salaries", getSalaries);
router.post("/get/invoices", getInvoicesByRange);

module.exports = router;

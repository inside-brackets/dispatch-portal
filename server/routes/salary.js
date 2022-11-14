const express = require("express");
const {
  updateSlots,
  createSalary,
  getSalaries,
} = require("../controllers/salary");

const router = express.Router();

router.post("/update/slots/:id", updateSlots);
router.post("/create/salary", createSalary);
router.post("/get/salaries", getSalaries);

module.exports = router;

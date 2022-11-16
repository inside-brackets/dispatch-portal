const express = require("express");
const { updateSlots, getSalaries } = require("../controllers/salary");

const router = express.Router();

router.post("/update/slots/:id", updateSlots);
router.post("/get/salaries", getSalaries);

module.exports = router;

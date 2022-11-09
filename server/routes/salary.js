const express = require("express");
const { updateSlots } = require("../controllers/salary");

const router = express.Router();

router.post("/update/slots/:id", updateSlots);

module.exports = router;

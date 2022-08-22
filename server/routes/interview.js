const express = require("express");
const {
  createInterview,
  getInterview,
  updateInterview,
  listInterviews,
  deleteInterview,
} = require("../controllers/interviews");

const router = express.Router();

router.post("/", createInterview);
router.get("/:id", getInterview);
router.put("/:id", updateInterview);
router.delete("/:id", deleteInterview);
router.post("/get-table-interviews", listInterviews);

module.exports = router;

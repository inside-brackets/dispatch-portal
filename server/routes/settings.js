const express = require("express");
const {
  updateSettings,
  getMCSettings,
  getCurrTarget,
  getTargetProgress,
  getChartData,
} = require("../controllers/settings");

const router = express.Router();

router.post("/update", updateSettings);
router.get("/", getMCSettings);
router.get("/target", getCurrTarget);
router.get("/target/progress", getTargetProgress);
router.get("/chart", getChartData);

module.exports = router;

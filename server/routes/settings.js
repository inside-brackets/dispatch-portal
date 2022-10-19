const express = require("express");
const {
  updateSettings,
  getMCSettings,
  getFreeResources,
  freeUpResource,
  getCurrTarget,
  getRegistered,
  getChartData,
} = require("../controllers/settings");

const router = express.Router();

router.post("/update", updateSettings);
router.get("/", getMCSettings);
router.post("/free", getFreeResources);
router.get("/freeup", freeUpResource);
router.get("/target", getCurrTarget);
router.get("/registered", getRegistered);
router.get("/chart", getChartData);

module.exports = router;

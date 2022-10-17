const express = require("express");
const {
  updateSettings,
  getMCSettings,
  getFreeResources,
  freeUpResource,
  getCurrTarget,
  getCurrDials,
} = require("../controllers/settings");

const router = express.Router();

router.post("/update", updateSettings);
router.get("/", getMCSettings);
router.post("/free", getFreeResources);
router.get("/freeres", freeUpResource);
router.get("/target", getCurrTarget);
router.get("/dials", getCurrDials);

module.exports = router;

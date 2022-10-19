const express = require("express");
const {
  updateSettings,
  getMCSettings,
  getFreeResources,
  freeUpResource,
  getCurrTarget,
  getRegistered,
} = require("../controllers/settings");

const router = express.Router();

router.post("/update", updateSettings);
router.get("/", getMCSettings);
router.post("/free", getFreeResources);
router.get("/freeup", freeUpResource);
router.get("/target", getCurrTarget);
router.get("/registered", getRegistered);

module.exports = router;

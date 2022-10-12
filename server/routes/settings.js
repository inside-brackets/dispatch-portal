const express = require("express");
const {
  updateSettings,
  getMCSettings,
  getFreeResources,
} = require("../controllers/settings");

const router = express.Router();

router.post("/update", updateSettings);
router.get("/", getMCSettings);
router.post("/free", getFreeResources);

module.exports = router;

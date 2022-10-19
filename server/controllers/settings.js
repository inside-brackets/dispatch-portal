const settings = require("../models/setting");
const Carrier = require("../models/carrier");
const Hcarrier = require("../models/hcarrier");

const updateSettings = async (req, res) => {
  console.log("updateSettings", req.body);
  try {
    let updatedSettings = await settings.findOneAndUpdate(
      {},
      { $set: req.body },
      { upsert: true, new: true }
    );
    res.status(200).send(updatedSettings);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getMCSettings = async (req, res) => {
  console.log("getSettings");
  try {
    let prevSettings = await settings.findOne({});
    if (!prevSettings) {
      prevSettings = await settings.create({});
    }
    res.status(200).send(prevSettings.mcSeries);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getCurrTarget = async (req, res) => {
  console.log("getTarget");
  try {
    let prevSettings = await settings.findOne({});
    if (!prevSettings) {
      prevSettings = await settings.create({});
    }
    res.status(200).send(prevSettings.target);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getFreeResources = async (req, res) => {
  console.log("getFreeResources");
  try {
    let freeResources = await Carrier.countDocuments({
      c_status: "unassigned",
      mc_number: {
        $gte: req.body.series.isCustom ? req.body.series.customFrom : 0,
        $lte: req.body.series.isCustom ? req.body.series.customTo : 990000,
      },
    });
    res.status(200).send(freeResources.toString());
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const freeUpResource = async (req, res) => {
  console.log("freeUpResources");
  try {
    await Carrier.updateMany(
      {
        c_status: "didnotpick",
      },
      { $unset: { salesman: 1 }, $set: { c_status: "unassigned" } }
    )
      .then((data) => {
        res.status(200).send();
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getRegistered = async (req, res) => {
  console.log("getRegistered");
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let result = await Hcarrier.countDocuments({
      createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 0) },
      change: { $in: ["registered"] },
    });
    res.status(200).send(result.toString());
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  updateSettings,
  getMCSettings,
  getFreeResources,
  freeUpResource,
  getCurrTarget,
  getRegistered,
};

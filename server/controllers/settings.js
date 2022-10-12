const settings = require("../models/setting");
const Carrier = require("../models/carrier");

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

module.exports = { updateSettings, getMCSettings, getFreeResources };

const settings = require("../models/setting");
const Hcarrier = require("../models/hcarrier");

const updateSettings = async (req, res) => {
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

const getTargetProgress = async (req, res) => {
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

const getChartData = async (req, res) => {
  try {
    let data = [];
    let result;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    for (var i = 0; i < 12; i++) {
      if (i > today.getMonth()) {
        data.push(null);
      } else {
        result = await Hcarrier.countDocuments({
          createdAt: {
            $gte: new Date(today.getFullYear(), i, 0),
            $lt: new Date(today.getFullYear(), i + 1, 0),
          },
          change: { $in: ["registered"] },
        });
        data.push(result);
      }
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  updateSettings,
  getMCSettings,
  getCurrTarget,
  getTargetProgress,
  getChartData,
};

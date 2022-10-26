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

const filterHistory = (history) => {
  let filtered = Object.values(
    history.reduce((a, b) => {
      if (a[b.mc_number]) {
        if (a[b.mc_number].updatedAt < b.updatedAt) {
          a[b.mc_number] = b;
        }
      } else {
        a[b.mc_number] = b;
      }
      return a;
    }, {})
  );
  return filtered;
};

const getChartData = async (req, res) => {
  try {
    let data = {
      registered: [],
      appointment: [],
      pieChart: [],
      users: [],
    };

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let register, appoint, reject;

    for (var i = 0; i < 12; i++) {
      const history = await Hcarrier.find({
        updatedAt: {
          $gte: new Date(today.getFullYear(), i, 0),
          $lt: new Date(today.getFullYear(), i + 1, 0),
        },
        change: ["rejected", "registered", "appointment"],
      });
      const filteredHistory = filterHistory(history);

      register =
        filteredHistory.filter((carrier) => carrier.change === "registered")
          .length ?? 0;
      appoint =
        filteredHistory.filter((carrier) => carrier.change === "appointment")
          .length ?? 0;
      reject =
        filteredHistory.filter((carrier) => carrier.change === "rejected")
          .length ?? 0;

      if (i == today.getMonth()) {
        data.users.push(filteredHistory);

        data.registered.push(register);
        data.appointment.push(appoint);

        data.pieChart.push(register);
        data.pieChart.push(appoint);
        data.pieChart.push(reject);
      } else if (i > today.getMonth()) {
        data.registered.push(null);
        data.appointment.push(null);
      } else {
        data.users.push(filteredHistory);

        data.registered.push(register);
        data.appointment.push(appoint);
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

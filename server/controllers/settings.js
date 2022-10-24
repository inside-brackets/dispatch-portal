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
    let data = {
      registered: [],
      appointment: [],
      pieChart: [],
    };
    let register, appoint, pie;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    for (var i = 0; i < 12; i++) {
      if (i > today.getMonth()) {
        data.registered.push(null);
        data.appointment.push(null);
      } else {
        register = await Hcarrier.countDocuments({
          createdAt: {
            $gte: new Date(today.getFullYear(), i, 0),
            $lt: new Date(today.getFullYear(), i + 1, 0),
          },
          change: { $in: ["registered"] },
        });
        appoint = await Hcarrier.countDocuments({
          createdAt: {
            $gte: new Date(today.getFullYear(), i, 0),
            $lt: new Date(today.getFullYear(), i + 1, 0),
          },
          change: { $in: ["appointment"] },
        });
        data.registered.push(register);
        data.appointment.push(appoint);
      }
    }
    const result = await Hcarrier.find({
      updatedAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), 0),
        $lt: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      },
      change: ["rejected", "registered", "appointment"],
    });
    pie = Object.values(
      result.reduce((a, b) => {
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
    const rejected = pie.filter((carrier) => carrier.change === "rejected");
    const registered = pie.filter((carrier) => carrier.change === "registered");
    const appointment = pie.filter(
      (carrier) => carrier.change === "appointment"
    );
    data.pieChart.push(
      registered && registered.length === 0 ? 0 : Number(registered.length)
    );
    data.pieChart.push(
      appointment && appointment.length === 0 ? 0 : Number(appointment.length)
    );
    data.pieChart.push(
      rejected && rejected.length === 0 ? 0 : Number(rejected.length)
    );

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

const mongoose = require("mongoose");
const settingSchema = new mongoose.Schema({
  mcSeries: {
    order: {
      type: Number,
      default: 1,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    customFrom: {
      type: Number,
      default: 1,
    },
    customTo: {
      type: Number,
      default: 999,
    },
  },
  target: {
    curr_target: {
      type: Number,
      default: 99,
    },
  },
});

module.exports = mongoose.model("Setting", settingSchema);

const mongoose = require("mongoose");
const loadSchema = require("./load")

const reportSchema = new mongoose.Schema(
  {
    carrier: { type: mongoose.Types.ObjectId, ref: "Carrier" },
    truck: { type: Number, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    dispatcher_comment: {
      type: String,
    },
    working_days: {
      type: Number,
      required: true,
    },
    loads:[],
    deadHead:[]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);

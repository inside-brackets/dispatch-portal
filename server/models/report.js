const mongoose = require("mongoose");
const loadSchema = require("./load")

const reportSchema = new mongoose.Schema(
  {
    carrier: { type: mongoose.Types.ObjectId, ref: "Carrier",required:true },
    truck: { type: Number, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    dispatcher_comment: {
      type: String,
    },
    manager_comment: {
      type: String,
    },
    dispatcher:{
      type: mongoose.Types.ObjectId, ref: "User" ,
      required:true
    },
    working_days: {
      type: Number,
      required: true,
    },

    loads:[{type: mongoose.Types.ObjectId, ref: 'Load'}],
    deadHead:[]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);

const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    month: {
      type: String,
      require: true,
    },
    invoices: [{ type: mongoose.Types.ObjectId, ref: "Invoices" }],
    adjustment: {
      type: Array,
    },
    incentivePKR: {
      type: Number,
    },
    incentiveDollars: {
      type: Number,
    },
    exchangeRate: {
      type: Number,
    },
    base: {
      type: Number,
    },
    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Salary", salarySchema);

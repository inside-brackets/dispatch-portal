const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      first_name: String,
      last_name: String,
      phone_number: String,
      address: String,
      designation: String,
      department: {
        type: String,
        enum: ["sales", "dispatch", "HR", "admin", "accounts", "undefined"],
        default: "undefined",
      },
      company: {
        type: String,
        enum: ["elite", "alpha", "falcon"],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["scheduled", "rejected", "hired", "pending-decision"],
      default: "scheduled",
    },
    remarks: String,
    time: {type:Date,required:true},
    interviewer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required:true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);

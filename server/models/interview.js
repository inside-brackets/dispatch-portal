const mongoose = require("mongoose");
const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      first_name: {
        type: String,
      },
      last_name: {
        type: String,
      },
      date_of_birth: {
        type: Date,
      },
      salary: {
        type: Number,
        require: true,
        trim: true,
      },

      phone_number: {
        type: String,
        trim: true,
      },
      email_address: {
        type: String,
      },
      address: {
        type: String,
      },
      designation: {
        type: String,
        default: "employee",
      },
      department: {
        type: String,
        enum: ["sales", "dispatch", "HR", "admin", "accounts", "undefined"],
        required: true,
      },
      company: {
        type: String,
        enum: ["elite", "alpha", "falcon"],
        required: true,
      },
    },
    interviewer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    remarks: String,
    date_time: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      require: true,
      unique: true,
    },
    profile_image: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    u_status: {
      type: String,
      enum: ["probation", "active", "fired", "inactive", "resigned"],
      default: "active",
    },
    password: String,
    date_of_birth: {
      type: Date,
    },
    salary: {
      type: Number,
      require: true,
      trim: true,
    },
    dispatch_salary_slots: {
      first: {
        lower_bound: { type: Number, default: 1500 },
        upper_bound: { type: Number, default: 4500 },
        percentage: { type: Number, default: 8 },
      },
      second: {
        upper_bound: { type: Number, default: 7000 },
        percentage: { type: Number, default: 10 },
      },
      third: {
        upper_bound: { type: Number, default: 9999999 },
        percentage: { type: Number, default: 12 },
      },
    },
    joining_date: {
      type: Date,
      require: true,
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
    bank_account: {
      type: Number,
    },
    designation: {
      type: String,
      required: true,
    },
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
    leaving_date: {
      type: Date,
    },
    files: [
      {
        name: {
          type: String,
          require: true,
        },
        file_type: {
          type: String,
          enum: [
            "cnic",
            "educational_document",
            "experience_document",
            "other",
            "cv",
            "contract",
          ],
          required: true,
        },
        file: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

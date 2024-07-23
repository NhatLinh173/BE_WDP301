const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recruiterSchema = new Schema(
  {
    emailRecruiter: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: Number },
    role: { type: String, default: "recruiter" },
    company: { type: String },
    gender: { type: String },
  },
  {
    timestamps: true,
  }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;

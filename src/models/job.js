// models/Job.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: { type: String, required: true },
  nameCompany: { type: String, required: true },
  description: { type: String, required: true },
  jobType: { type: String, required: true },
  jobCategories: { type: String, required: true },
  salaryType: { type: String, required: true },
  minSalary: { type: Number, required: true },
  maxSalary: { type: Number, required: true },
  skills: { type: String, required: true },
  qualifications: { type: String, required: true },
  experience: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  workPlace: { type: String, required: false },
  userId: { type: String, require: true },
  reason: { type: [String], required: true },
  workingDays: { type: [String], required: true },
  image: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  expiredDate: { type: Date },
  status: { type: String, require: true },
  applications: [
    {
      applicant: { type: Schema.Types.ObjectId, ref: "User" },

      cvPath: { type: String },
      degreePath: { type: String },
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      image: { type: String },
      introduce: { type: String },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

// models/Job.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  jobType: { type: String, required: true },
  jobCategories: { type: String, required: true },
  salaryType: { type: String, required: true },
  minSalary: { type: Number, required: true },
  maxSalary: { type: Number, required: true },
  skills: { type: String, required: true },
  qualifications: { type: String, required: true },
  experience: { type: String, required: true },
  industry: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

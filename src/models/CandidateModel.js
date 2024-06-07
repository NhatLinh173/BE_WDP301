const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CandidateProfileSchema = new Schema(
  {
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: false },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    website: { type: String, required: false },
    address: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    sex: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CandidateProfile", CandidateProfileSchema);

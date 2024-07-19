const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const cvSchema = new Schema({
  cvName: { type: String },
  cvPath: { type: String },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

const degreeSchema = new Schema({
  degreeName: { type: String },
  degreePath: { type: String },
  uploadDate: { type: Date, default: Date.now },
});
const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    address: { type: String },
    phone: { type: Number },
    access_token: { type: String },
    refresh_token: { type: String },
    role: { type: String },
    candidateProfile: { type: Schema.Types.ObjectId, ref: "CandidateProfile" },
    cvList: [cvSchema],
    degreeList: [degreeSchema],

    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;

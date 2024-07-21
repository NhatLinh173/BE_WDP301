const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Recruiter = require("../models/RecruiterModel");
const RecruiterService = require("../service/RecruiterService");

const signUp = async (req, res) => {
  try {
    const { email, password, addressCompany, phone, nameCompany, gender } =
      req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (
      !email ||
      !password ||
      !addressCompany ||
      !phone ||
      !nameCompany ||
      !gender
    ) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email and password are required",
      });
    } else if (!reg.test(email)) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid email format",
      });
    }
    const response = await RecruiterService.signUpRecruiter(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Email and password are required" });
    }
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "recruiter not found" });
    }

    console.log("Password from request:", password);
    console.log("Hashed password from DB:", recruiter.password);

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Incorrect password" });
    }
    const token = jwt.sign(
      { id: recruiter._id, role: recruiter.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      status: "OK",
      message: "Login SUCCESS",
      token,
      recruiter: {
        id: recruiter._id,
        email: recruiter.email,
        token,
        role: recruiter.role,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  signUp,
  login,
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Recruiter = require("../models/RecruiterModel");
const RecruiterService = require("../service/RecruiterService");

const signUp = async (req, res) => {
  try {
    const {
      emailRecruiter,
      password,
      fullName,
      phone,
      company,
      gender,
      city,
      district,
    } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (
      !emailRecruiter ||
      !password ||
      !district ||
      !phone ||
      !company ||
      !gender ||
      !fullName ||
      !city
    ) {
      return res.status(400).json({
        status: "ERROR",
        message: "All fields are required",
      });
    } else if (!reg.test(emailRecruiter)) {
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
    const { emailRecruiter, password } = req.body;
    if (!emailRecruiter || !password) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Email and password are required" });
    }
    const recruiter = await Recruiter.findOne({ emailRecruiter });
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
        emailRecruiter: recruiter.emailRecruiter,
        token,
        role: recruiter.role,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
// Thinh - getAllRecruiters
const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find();
    res.status(200).json(recruiters);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recruiters', error: error.message });
  }
};

// Thinh - deleteRecruiter
const deleteRecruiter = async (req, res) => {
  const { recruiterId } = req.params;

  try {
    const recruiter = await Recruiter.findByIdAndDelete(recruiterId);

    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    res.status(200).json({ message: 'Recruiter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recruiter', error: error.message });
  }
};

module.exports = {
  signUp,
  login,
  getAllRecruiters,
  deleteRecruiter,
};

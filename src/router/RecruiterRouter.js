const express = require("express");
const router = express.Router();
const loginRecruiter = require("../controller/RecruiterController");

router.post("/login-recruiter", loginRecruiter.login);
router.post("/register-recruiter", loginRecruiter.signUp);

module.exports = router;

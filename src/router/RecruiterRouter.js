const express = require("express");
const router = express.Router();
const loginRecruiter = require("../controller/RecruiterController");
const recruiterController = require("../controller/RecruiterController")
router.post("/login-recruiter", loginRecruiter.login);
router.post("/register-recruiter", loginRecruiter.signUp);

// Thinh - getAllRecruiters
router.get('/getAllRecruiter', recruiterController.getAllRecruiters);

// Thinh - deleteRecruiter
router.delete('/deleteRecruiter/:recruiterId', recruiterController.deleteRecruiter);
module.exports = router;

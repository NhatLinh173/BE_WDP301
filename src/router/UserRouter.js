const express = require("express");

const router = express.Router();
userController = require("../controller/UserController");
candidateController = require("../controller/CandidateController");

router.post("/sign-up", userController.signUp);
module.exports = router;

const express = require("express");

const router = express.Router();
candidateController = require("../controller/CandidateController");

router.get("/profiles/:id", candidateController.getProfileById);
router.post("/create-profile", candidateController.createProfile);
module.exports = router;

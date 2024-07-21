const express = require("express");
const router = express.Router();
const candidateController = require("../controller/CandidateController");
const uploadsFirebase = require("../utils/uploadsFirebase");

router.post(
  "/create-profile",
  uploadsFirebase.single("image"),
  candidateController.createProfile
);
router.get("/profiles/:userId", candidateController.getProfileById);
router.post(
  "/profiles/update/:userId",
  uploadsFirebase.single("image"),
  candidateController.updateProfile
);

module.exports = router;

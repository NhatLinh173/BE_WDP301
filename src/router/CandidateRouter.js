const express = require("express");
const router = express.Router();
const candidateController = require("../controller/CandidateController");
const upload = require("../utils/upload");

router.post(
  "/create-profile",
  upload.single("image"),
  candidateController.createProfile
);
router.get("/profiles/:userId", candidateController.getProfileById);
router.post(
  "/profiles/update/:userId",
  upload.single("image"),
  candidateController.updateProfile
);

module.exports = router;

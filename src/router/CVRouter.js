const express = require("express");
const router = express.Router();
const CV = require("../models/CV");
const CVType = require("../models/CvType");

// Get all CVs
router.get("/cvs", async (req, res) => {
  try {
    let cvs = await CV.find();
    res.json(cvs);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
// Create a new CV
router.post("/cvs", async (req, res) => {
  const cv = new CV(req.body);
  try {
    const newCV = await cv.save();
    res.status(201).json(newCV);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new CV Type
router.post("/cvtypes", async (req, res) => {
  const cvType = new CVType(req.body);
  try {
    const newCVType = await cvType.save();
    res.status(201).json(newCVType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all CV Types
router.get("/cvtypes", async (req, res) => {
  try {
    const cvTypes = await CVType.find();
    res.json(cvTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

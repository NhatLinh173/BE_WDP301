const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const User = require("../models/UserModel");

const router = express.Router();
router.use(bodyParser.json());

const uploadPath = path.join(__dirname, "../public/degrees");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, sanitizedFilename);
  },
});

const degreeFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(pdf|doc|docx|jpg|jpeg|png)$/)) {
    return cb(
      new Error("You can upload only document and image files!"),
      false
    );
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: degreeFileFilter });

router.get("/:userId/degrees", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("degreeList");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ degreeList: user.degreeList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:userId", upload.array("degreeFiles", 10), async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newDegrees = req.files.map((file) => ({
      degreeName: file.originalname,
      degreePath: path.join(uploadPath, file.filename),
    }));

    user.degreeList.push(...newDegrees);
    await user.save();

    res
      .status(200)
      .json({ message: "Degrees uploaded successfully", user: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/download/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadPath, filename);

    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      return res.status(404).json({ message: "File not found." });
    }

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:userId/:filename", async (req, res) => {
  try {
    const userId = req.params.userId;
    const filename = req.params.filename;

    const filePath = path.join(uploadPath, filename);
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      return res.status(404).json({ message: "File not found." });
    }

    await fs.unlink(filePath);

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { degreeList: { degreePath: filePath } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "Degree deleted successfully", user: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const User = require("../models/UserModel");
const path = require("path");
const fs = require("fs").promises;

const uploadPath = path.join(__dirname, "../public/cvs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, sanitizedFilename);
  },
});

const cvFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: cvFileFilter });

const router = express.Router();

router.use(bodyParser.json());

router
  .get("/:userId/cvs", async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).select("cvList");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ cvList: user.cvList });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .post("/:userId", upload.single("cvFile"), async (req, res) => {
    try {
      const userId = req.params.userId;
      const { originalname, filename } = req.file;
      const newCV = {
        cvName: originalname,
        cvPath: path.join(uploadPath, filename),
      };
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { cvList: newCV } },
        { new: true }
      );
      res.status(200).json({ message: "CV uploaded successfully", user: user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .get("/download/:filename", async (req, res) => {
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
  })
  .delete("/:userId/:filename", async (req, res) => {
    try {
      const userId = req.params.userId;
      const filename = req.params.filename;

      const filePath = path.join(uploadPath, filename);
      console.log("filePath: " + filePath);
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        return res.status(404).json({ message: "File not found." });
      }

      await fs.unlink(filePath);

      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { cvList: { cvPath: filePath } } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({ message: "CV deleted successfully", user: user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;

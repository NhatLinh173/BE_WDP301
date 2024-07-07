const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const User = require("../models/UserModel");
const path = require("path");
const fs = require("fs").promises; // Sử dụng fs.promises để sử dụng async-await với fs

// Đường dẫn tới thư mục lưu trữ tệp
const uploadPath = path.join(__dirname, "../public/cvs");

// Thiết lập lưu trữ cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, sanitizedFilename);
  },
});

// Bộ lọc tệp cho multer
const cvFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

// Khởi tạo multer với các cài đặt
const upload = multer({ storage: storage, fileFilter: cvFileFilter });

// Khởi tạo router Express
const router = express.Router();

// Sử dụng bodyParser cho JSON
router.use(bodyParser.json());

// Định nghĩa các endpoint
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
        cvPath: path.join(uploadPath, filename), // Đường dẫn tuyệt đối đến tệp
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

      // Kiểm tra xem tệp tồn tại
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

      // Xây dựng đường dẫn tuyệt đối đến tệp
      const filePath = path.join(uploadPath, filename);
      console.log("filePath: " + filePath);
      // Kiểm tra xem tệp tồn tại
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        return res.status(404).json({ message: "File not found." });
      }

      // Xóa tệp vật lý từ hệ thống tệp
      await fs.unlink(filePath);

      // Cập nhật cơ sở dữ liệu
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

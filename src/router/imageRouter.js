const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../utils", filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error sending file: ${filename}`, err);
      res.status(404).send("File not found");
    }
  });
});

module.exports = router;

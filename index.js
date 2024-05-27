const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = 3000;

app.use(express.json());
mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

app.listen(PORT, () => {
  console.log(`App running with PORT http://localhost:${PORT}`);
});

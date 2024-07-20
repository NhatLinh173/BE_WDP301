const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./src/router");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
dotenv.config();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "utils")));

app.use(cors());
app.use(bodyParser.json());
routes(app);


const dbURI =
  process.env.MONGO_DB ||
  "mongodb+srv://thinhph9:viQilFKh1mNREcgB@fjobdb.vliqvdr.mongodb.net/FJobDB";

app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect DB success!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

module.exports = app;

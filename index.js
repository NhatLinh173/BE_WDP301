const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./src/router");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
require("./src/models/authenticate");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Khởi tạo Passport.js
app.use(passport.initialize());

// Sử dụng các tuyến đường
routes(app);

const jobPostRouter = require("./src/router/jobRouter");

const dbURI =
  process.env.MONGO_DB ||
  "mongodb+srv://thinhph9:viQilFKh1mNREcgB@fjobdb.vliqvdr.mongodb.net/FJobDB";

// Kết nối tới MongoDB Atlas
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

// app.listen(port, () => {
//   console.log(`App running with PORT http://localhost:${port}`);
// });

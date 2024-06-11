const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jobPostRouter = require("./src/router/jobRouter");
const PORT = 3000;

const dbURI =
  process.env.MONGO_DB ||
  "mongodb+srv://thinhph9:viQilFKh1mNREcgB@fjobdb.vliqvdr.mongodb.net/FJobDB";

app.use(express.json());
mongoose
  .connect(dbURI || `${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect DB success!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/job", jobPostRouter);

app.listen(PORT, () => {
  console.log(`App running with PORT http://localhost:${PORT}`);
});

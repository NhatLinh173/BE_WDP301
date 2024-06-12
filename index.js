const express = require("express");

const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require('./src/router');
const cors = require('cors');
const bodyParser = require("body-parser");

dotenv.config()
const app = express();
const port = process.env.PORT || 3005


app.use(cors())
// bodyParser before routes(app)
app.use(bodyParser.json())

routes(app);

const jobPostRouter = require("./src/router/jobRouter");


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

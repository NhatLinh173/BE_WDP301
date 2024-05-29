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

app.use(express.json());

  // Connnect MONGO_DB ATLAS
mongoose.connect(`${process.env.MONGO_DB}`)
.then(() => {
    console.log("Connect DB success!")
})
.catch((err) => {
    console.log(err)
})




app.listen(port, () => {
  console.log('App running with PORT http://localhost: ', port);
});

const UserRouter = require("./UserRouter");
const CVRouter = require("./CVRouter");
const JobRouter = require('./jobRouter') 

// container all API
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/CV", CVRouter);
  app.use('/job', JobRouter)
};

module.exports = routes;


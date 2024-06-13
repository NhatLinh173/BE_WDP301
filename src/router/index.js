const UserRouter = require("./UserRouter");
const CVRouter = require("./CVRouter");

// container all API
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/CV", CVRouter);
};

module.exports = routes;


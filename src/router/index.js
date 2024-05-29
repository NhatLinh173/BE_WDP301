const UserRouter = require('./UserRouter')


// container all API
const routes = (app) => {
    app.use('/api/user', UserRouter)

}

module.exports = routes
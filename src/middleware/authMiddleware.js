const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    // console.log("check Token", req.headers.token)
    const token = req.headers.token.split(' ')[1]
    // const token = req.headers.token
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })
        }
        // const { payload } = user
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    // console.log("req.headers", req.headers)
    const token = req.headers.token.split(' ')[1]
    // const token = req.headers.token
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })
        }
        // const { payload } = user
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })
        }
    });
}

module.exports = {
    authMiddleWare,
    authUserMiddleWare
}
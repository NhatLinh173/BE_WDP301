const express = require("express");

const router = express.Router();
userController = require('../controller/UserController')


router.post ('/sign-up', userController.signUp)

module.exports = router
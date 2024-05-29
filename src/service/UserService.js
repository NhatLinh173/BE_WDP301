const User = require('../models/UserModel')
// const bcrypt = require("bcrypt")

const signUp = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {email, password} = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'OK',
                    message: 'The email is already'
                })
            }
            // const hash = bcrypt.hashSync(password, 10)
            // console.log("hash", hash)
            const createdUser = await User.create({
                email,
                password
            })

            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'signUp SUCCESS',
                    data: createdUser
                })
            }
            resolve({})
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    signUp
}
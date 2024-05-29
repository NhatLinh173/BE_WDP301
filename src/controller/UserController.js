const UserService = require('../service/UserService')

const signUp = async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERRO',
                message: 'The input is required'
            })

        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERRO',
                message: 'The input is email'
            })

        }
        // console.log("isCheckEmail", isCheckEmail)
        const response = await UserService.signUp(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    signUp
}

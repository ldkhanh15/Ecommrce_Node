const userService = require('../services/user')

const getUser = async(req, res) => {
    try {
        const user = await userService.getUser(req.body)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode:1,
            errMessage:'Error from Server'
        })
    }
}

module.exports = {
    getUser
}
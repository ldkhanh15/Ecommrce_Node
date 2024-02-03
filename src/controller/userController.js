import userService from '../services/userService'

const getUser = async (req, res) => {
    try {
        const data = await userService.getUser();
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createUser = async (req, res) => {
    try {
        const data = await userService.createUser(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getUser,
    createUser,
}
import userService from '../services/userService'

const getUser = async (req, res) => {
    try {
        const data = await userService.getUser(req)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createUser = async (req, res) => {
    try {
        const data = await userService.createUser(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    try {
        const data = await userService.updateUser(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const data = await userService.deleteUser(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
}
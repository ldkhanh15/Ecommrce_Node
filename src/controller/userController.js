import userService from '../services/userService'

const getUser = async (req, res) => {
    try {
        const data = await userService.getUser(req)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const getCustomer = async (req, res) => {
    try {
        const data = await userService.getCustomer(req)
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


//ADDRESS
const getAddress = async (req, res) => {
    try {
        const data = await userService.getAddress(req)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createAddress = async (req, res) => {
    try {
        const data = await userService.createAddress(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const updateAddress = async (req, res) => {
    try {
        const data = await userService.updateAddress(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const deleteAddress = async (req, res) => {
    try {
        const data = await userService.deleteAddress(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const getSearch = async (req, res) => {
    try {
        const data = await userService.getSearch(req);
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
    getCustomer,
    getAddress,
    createAddress,
    deleteAddress,
    updateAddress,
    getSearch
}
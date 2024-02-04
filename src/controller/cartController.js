import cartService from '../services/cartService'


const getCart = async (req, res) => {
    try {
        let data = await cartService.getCart(req);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

const addCart = async (req, res) => {
    try {
        let data = await cartService.addCart(req);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

const deleteCart = async (req, res) => {
    try {
        let data = await cartService.deleteCart(req);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

const updateCart = async (req, res) => {
    try {
        let data = await cartService.updateCart(req);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getCart,
    addCart,
    deleteCart,
    updateCart,
}
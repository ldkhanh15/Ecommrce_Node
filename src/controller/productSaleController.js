import productSaleService from '../services/productSaleService'

const getAllProduct = async (req, res) => {
    try {
        let data = await productSaleService.getAllProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const addProduct = async (req, res) => {
    try {
        let data = await productSaleService.addProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const buyProduct = async (req, res) => {
    try {
        let data = await productSaleService.buyProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const deleteProduct = async (req, res) => {
    try {
        let data = await productSaleService.deleteProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const updateProduct = async (req, res) => {
    try {
        let data = await productSaleService.updateProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const getSearch = async (req, res) => {
    try {
        let data = await productSaleService.getSearch(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
module.exports ={
    getAllProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    buyProduct,
    getSearch
}
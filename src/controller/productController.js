import productService from '../services/productService'

const getProduct = async (req, res) => {
    try {
        let data = await productService.getProduct(req.body);
        return res.status(200).json({
            data,
            message: 'success'
        })
    } catch (error) {
        console.log(error);
    }
}
const createProduct = async (req, res) => {
    try {
        let data = await productService.createProduct(req.body);
        return res.status(200).json({
            data,
            message: 'success'
        })
    } catch (error) {
        console.log(error);
    }
}
const getSize = async (req, res) => {
    try {
        let data = await productService.getSize();
        return res.status(200).json({
            data,
            message: 'success'
        })
    } catch (error) {
        console.log(error);
    }
}
const createSize = async (req, res) => {
    try {
        let data = await productService.createSize(req.body);
        return res.status(200).json({
            data,
            message: 'success'
        })
    } catch (error) {
        console.log(error);
    }
}
const deleteSize = async (req, res) => {
    try {
        let data = await productService.deleteSize(req.body);
        return res.status(200).json({
            data,
            message: 'success'
        })
    } catch (error) {
        console.log(error);
    }
}
const updateSize = async (req, res) => {
    try {
        let data = await productService.updateSize(req.body);
        return res.status(200).json({
            data,
            message: 'success'
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getProduct,
    createProduct,
    getSize,
    createSize,
    updateSize,
    deleteSize
}
import productService from '../services/product'

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
module.exports = {
    getProduct,
    createProduct
}
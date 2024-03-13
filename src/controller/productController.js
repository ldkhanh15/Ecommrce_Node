import productService from '../services/productService'

const getProduct = async (req, res) => {
    try {
        let data = await productService.getProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const getProductOfShop = async (req, res) => {
    try {
        let data = await productService.getProductOfShop(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const getProductShop = async (req, res) => {
    try {
        let data = await productService.getProductShop(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const getProductComment = async (req, res) => {
    try {
        let data = await productService.getProductComment(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const createProduct = async (req, res) => {
    try {
        let data = await productService.createProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const createProductComment = async (req, res) => {
    try {
        let data = await productService.createProductComment(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const deleteProductComment = async (req, res) => {
    try {
        let data = await productService.deleteProductComment(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const updateProductComment = async (req, res) => {
    try {
        let data = await productService.updateProductComment(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const deleteProduct = async (req, res) => {
    try {
        let data = await productService.deleteProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const updateProduct = async (req, res) => {
    try {
        let data = await productService.updateProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const likeProduct = async (req, res) => {
    try {
        let data = await productService.likeProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const unlikeProduct = async (req, res) => {
    try {
        let data = await productService.unlikeProduct(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductShop,
    getProductComment,
    createProductComment,
    deleteProductComment,
    updateProductComment,
    likeProduct,
    unlikeProduct,
    getProductOfShop,
}
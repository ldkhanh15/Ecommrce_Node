import db from '../models'
import { Op } from 'sequelize'
import joi from 'joi'
import { id, idProduct, quantity, start, end } from '../helpers/joi_schema'

const getAllProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.ProductSale.findAll({
                where: {
                    start: {
                        [Op.lt]: new Date(),
                    },
                    end: {
                        [Op.gt]: new Date()
                    }
                },
                include: [
                    {
                        model: db.Product, as: 'product', attributes: ['id', 'name', 'price', 'mainImage', 'hoverImage', 'sale', 'brand', 'sold'],
                        include: [
                            {
                                model: db.Shop, as: 'shop', attributes: ['username']
                            },
                            {
                                model: db.ProductReview, as: 'review', attributes: ['star']
                            }
                        ]
                    }
                ]
            })
            resolve({
                message: 'Get all products sale successfully',
                code: 1,
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

const addProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ idProduct, quantity, start, end }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let product = await db.Product.findOne({
                    where: {
                        id: req.body.idProduct,
                    }
                })
                if (!product) {
                    resolve({
                        message: 'Product not found',
                        code: 0
                    })
                } else {
                    let saleExist = await db.ProductSale.findOne({
                        where: {
                            idProduct: req.body.idProduct,
                        }
                    })
                    if (saleExist) {
                        resolve({
                            message: 'This product has already been sale',
                            code: 0
                        })
                    } else {

                        let productSale = await db.ProductSale.create({
                            ...req.body,
                            sold: 0
                        })
                        await productSale.save()
                        resolve({
                            message: 'Add product to promotion successfully',
                            code: 1
                        })
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let productSale = await db.ProductSale.findOne({
                    where: {
                        id: req.query.id,
                    }
                })
                if (!productSale) {
                    resolve({
                        message: 'Product don\'t promotion',
                        code: 0
                    })
                } else {
                    await db.ProductSale.destroy({
                        where: {
                            id: productSale.id,
                        }
                    })
                    resolve({
                        message: 'ProductSale deleted successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, quantity, start, end }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let productSale = await db.ProductSale.findOne({
                    where: {
                        id: req.body.id,
                    }
                })
                if (!productSale) {
                    resolve({
                        message: 'Product don\'t promotion',
                        code: 0
                    })
                } else {
                    await db.ProductSale.update({
                        ...req.body
                    }, {
                        where: {
                            id: productSale.id,
                        }
                    })
                    resolve({
                        message: 'ProductSale updated successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const buyProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let productSale = await db.ProductSale.findOne({
                    where: {
                        id: req.body.id,
                    }
                })
                if (!productSale) {
                    resolve({
                        message: 'Product don\'t promotion',
                        code: 0
                    })
                } else {
                    await db.ProductSale.update({
                        ...req.body
                    }, {
                        where: {
                            id: productSale.id,
                        }
                    })
                    resolve({
                        message: 'ProductSale updated successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getAllProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    buyProduct
}
import db from '../models'
import { quantity, id, idProduct } from '../helpers/joi_schema'
import joi from 'joi'

const getCart = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = req.query;
            let data = await db.Cart.findOne({
                where: { idUser: id },
                include: [
                    {
                        model: db.Product, as: 'product', attributes: ['id','sale','name','mainImage','price','avgStar']
                    }
                ]
            })
            resolve({
                message: 'Successfully',
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}
const addCart = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(req.body);
            const error = joi.object({ quantity, idProduct }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let [cart, created] = await db.Cart.findOrCreate({
                    where: { idUser: req?.user?.id },
                    defaults: {
                        idUser: req?.user?.id
                    },
                })
                if (!cart) {
                    resolve({
                        message: 'Cart ID not found',
                        code: 0
                    })
                } else {
                    let product = await db.Product.findOne({
                        where: { id: req.body.idProduct }
                    })
                    if (!product) {
                        resolve({
                            message: 'Product ID not found',
                            code: 0
                        })
                    } else {
                        let CP = await db.CartProduct.findOne({
                            where: {
                                idCart: cart.id,
                                idProduct: req.body.idProduct
                            }
                        })
                        if (!CP) {
                            let cartProduct = await db.CartProduct.create({
                                idProduct: req.body.idProduct,
                                quantity: req.body.quantity,
                                idCart: cart.id
                            })
                            await cartProduct.save()

                            resolve({
                                message: 'Add product to cart successfully',
                                code: 1
                            })
                        } else {
                            resolve({
                                message: 'This product has already been in cart',
                                code: 0
                            })
                        }
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteCart = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idProduct }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let [cart, created] = await db.Cart.findOrCreate({
                    where: { idUser: req.query.id }
                })
                if (!cart) {
                    resolve({
                        message: 'Cart ID not found',
                        code: 0
                    })
                } else {
                    await db.CartProduct.destroy({
                        where: {
                            idCart: cart.id,
                            idProduct: req.query.idProduct
                        }
                    })

                    resolve({
                        message: 'Delete product in Cart successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteCartAll = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let [cart, created] = await db.Cart.findOrCreate({
                    where: { idUser: req.query.id }
                })
                if (!cart) {
                    resolve({
                        message: 'Cart ID not found',
                        code: 0
                    })
                } else {
                    await db.CartProduct.destroy({
                        where: {
                            idCart: cart.id,
                        }
                    })

                    resolve({
                        message: 'Delete all product in Cart successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateCart = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idProduct, quantity }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let [cart, created] = await db.Cart.findOrCreate({
                    where: { idUser: req.body.id }
                })
                if (!cart) {
                    resolve({
                        message: 'Cart ID not found',
                        code: 0
                    })
                } else {
                    await db.CartProduct.update({
                        quantity: req.body.quantity,
                    }, {
                        where: {
                            idCart: cart.id,
                            idProduct: req.body.idProduct
                        }
                    })

                    resolve({
                        message: 'Update product in Cart successfully',
                        code: 1,
                    })
                }
            }
        } catch (error) {

            reject(error)
        }
    })
}
module.exports = {
    getCart,
    deleteCart,
    addCart,
    updateCart,
    deleteCartAll
}
import db from '../models'
import joi from 'joi'
import { id, idStatus, idBuyer, idShop, idAddress, idDeliver, idPayment, totalPrice, products } from '../helpers/joi_schema'
const getBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            if (req.user.role === 'R1') {
                data = await db.Bill.findAll({
                    include: [
                        {
                            model: db.Product, as: 'product', attributes: ['name', 'price', 'mainImage']
                        }
                    ]
                })
            } else if (req.user.role === 'R2') {
                let id = req.user.id;
                data = await db.Bill.findAll({
                    where: {
                        idShop: id
                    },
                    include: [
                        {
                            model: db.Product, as: 'product', attributes: ['name', 'price','mainImage']
                        }
                    ]
                })
            } else if (req.user.role === 'R3') {
                let { id } = req.user.id;
                data = await db.Bill.findAll({
                    where: {
                        idBuyer: id
                    },
                    include: [
                        {
                            model: db.Product, as: 'product', attributes: ['name', 'price','mainImage']
                        }
                    ]
                })
            }
            resolve({
                message: 'Successfully',
                data,
                code: 1
            })
        } catch (error) {
            reject(error)
        }
    })
}


const createBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({
                idBuyer, idShop, totalPrice, idAddress, idDeliver, idPayment, products
            }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {

                let { products, idBuyer, idShop, totalPrice, idAddress, idDeliver, idPayment } = req.body
                if (req.user.role !== 'R1') {

                    if (req.user.id != idBuyer) {
                        resolve({
                            code: 1,
                            message: 'You cannot create bill for another user'
                        })
                        return;
                    }
                }
                let bill = await db.Bill.create({
                    idBuyer,
                    idShop,
                    totalPrice,
                    idAddress,
                    idDeliver,
                    idPayment,
                    idStatus: 1
                })
                await bill.save()
                if (bill) {
                    await Promise.all(products?.map(async (product) => {
                        let BP = await db.BillProduct.create({
                            idBill: bill.id,
                            idProduct: product.id,
                            quantity: product.quantity,
                            type: product.type
                        })
                        await BP.save()
                    }))
                }
                resolve({
                    message: 'Successfully',
                    code: 1,
                    products: products
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate({ id: req.body?.id });
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let bill = await db.Bill.findOne({
                    where: {
                        id: req.body?.id
                    }
                })
                if (!bill) {
                    resolve({
                        code: 0,
                        message: 'Bill ID not found'
                    })
                }
                if (!req.body?.products) {
                    await db.Bill.update({ idStatus: 5 }, {
                        where: { id: req.body.id }
                    })
                    await db.BillProduct.destroy({
                        where: {
                            idBill: bill.id
                        }
                    })
                    resolve({
                        code: 1,
                        message: `Bill has id : ${req.body.id} deleted`
                    })
                } else {
                    req.body?.products.map(async (product) => {
                        console.log(1);
                        await db.BillProduct.destroy({
                            where: {
                                idBill: req.body.id,
                                idProduct: product.id
                            }
                        })

                    })
                    resolve({
                        code: 1,
                        message: `Product in bill has id : ${req.body.id} updated`
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, products, idStatus }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let bill = await db.Bill.findOne({
                    where: {
                        id: req.body?.id
                    }
                })
                if (!bill) {
                    resolve({
                        code: 0,
                        message: 'Bill ID not found'
                    })
                }
                await db.Bill.update({ idStatus: req.body?.idStatus }, {
                    where: { id: req.body.id }
                })
                req.body?.products.map(async (product) => {

                    await db.BillProduct.update({ quantity: product.quantity }, {
                        where: {
                            idBill: req.body.id,
                            idProduct: product.id
                        }
                    })

                })

                resolve({
                    code: 1,
                    message: `Bill has id : ${req.body.id} updated`
                })

            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getBill,
    createBill,
    deleteBill,
    updateBill,
}
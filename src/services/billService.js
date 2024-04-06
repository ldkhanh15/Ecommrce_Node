import db from '../models'
import joi from 'joi'
import { type, id, idStatus, idProduct, idBuyer, idShop, idAddress, idDeliver, idPayment, totalPrice, products, status } from '../helpers/joi_schema'
const getBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            if (req.user.role === 'R1') {
                data = await db.Bill.findAll({
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['name']
                        },
                        {
                            model: db.StatusBill, as: 'status', attributes: ['status']
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
                            model: db.Shop, as: 'shop', attributes: ['name']
                        },
                        {
                            model: db.StatusBill, as: 'status', attributes: ['status']
                        }
                    ]
                })
            } else if (req.user.role === 'R3') {
                data = await db.Bill.findAll({
                    where: {
                        idBuyer: req.user.id
                    },
                    include: [
                        {
                            model: db.StatusBill, as: 'status', attributes: ['status']
                        },
                        {
                            model:db.AddressUser, as: 'address', attributes:['address']
                        },
                        {
                            model: db.Product, as: 'product', attributes: ['name', 'mainImage', 'price', 'sale'],
                            include: [
                                {
                                    model: db.Shop, as: 'shop', attributes: ['name', 'id']
                                },
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                }
                            ]
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

const getDetailBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let data = await db.Bill.findOne({
                    where: {
                        id: req.query.id,
                    },
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['id', 'name', 'avatar', 'phone', 'address']
                        },
                        {
                            model: db.User, as: 'user', attributes: ['name', 'avatar', 'phone']
                        },
                        {
                            model: db.Product, as: 'product', attributes: ['id', 'name', 'price', 'sale', 'mainImage'],
                            include: [
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                }
                            ]
                        },
                        {
                            model: db.StatusBill, as: 'status', attributes: ['status']
                        },
                        {
                            model: db.AddressUser, as: 'address', attributes: ['address']
                        },
                        {
                            model: db.Payment, as: 'payment', attributes: ['name']
                        },
                        {
                            model: db.Deliver, as: 'deliver', attributes: ['name', 'price']
                        }
                    ]
                })
                resolve({
                    message: 'Successfully',
                    data,
                    code: 1
                })
            }
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

const createBillSale = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({
                type, idBuyer, idShop, totalPrice, idAddress, idDeliver, idPayment, idProduct
            }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {

                let { type, idProduct, idBuyer, idShop, totalPrice, idAddress, idDeliver, idPayment } = req.body
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
                    let product = await db.Product.findOne({
                        where: {
                            id: idProduct
                        }
                    })
                    if (!product) {
                        resolve({
                            message: 'Product not found',
                            code: 0
                        })
                    } else {

                        let BP = await db.BillProduct.create({
                            idBill: bill.id,
                            idProduct: idProduct,
                            quantity: 1,
                            type: type
                        })
                        await BP.save()
                    }

                }
                resolve({
                    message: 'Successfully',
                    code: 1,
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
            const error = joi.object({ id }).validate(req.query);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let bill = await db.Bill.findOne({
                    where: {
                        id: req.query.id
                    }
                })
                if (!bill) {
                    resolve({
                        code: 0,
                        message: 'Bill ID not found'
                    })
                } else {

                    await db.BillProduct.destroy({
                        where: {
                            idBill: bill.id,
                        }
                    })
                    await db.Bill.destroy({
                        where: { id: bill.id }
                    })

                    resolve({
                        code: 1,
                        message: `Deleted Bill`
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
            const error = joi.object({ id, totalPrice, products }).validate(req.body);
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
                await db.Bill.update(req.body, {
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
const updateStatusBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idStatus }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {
                let bill = await db.Bill.findOne({
                    where: {
                        id: req.body.id,
                    }
                })
                if (!bill) {
                    resolve({
                        message: 'bill id not found',
                        code: 0
                    })
                } else {
                    let status = await db.StatusBill.findOne({
                        where: {
                            id: req.body.idStatus,
                        }
                    })
                    if (!status) {
                        resolve({
                            message: 'status not found',
                            code: 0
                        })
                    } else {

                        await db.Bill.update(req.body, {
                            where: { id: req.body.id }
                        })
                        resolve({
                            message: 'Successfully updated status bill',
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

const getStatus = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.StatusBill.findAll();
            resolve({
                message: 'Successfully',
                code: 1,
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}
const createStatus = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ status }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {
                let status = await db.StatusBill.create({
                    ...req.body
                })
                await status.save();
                resolve({
                    message: 'Successfully created',
                    code: 1
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateStatus = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, status }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {

                let status = await db.StatusBill.findOne({
                    where: { id: req.body.id }
                })
                if (!status) {
                    resolve({
                        message: 'Status id not found',
                        code: 0
                    })
                } else {
                    await db.StatusBill.update(req.body, {
                        where: { id: status.id }
                    })
                    resolve({
                        message: 'Successfully updated',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteStatus = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {

                let status = await db.StatusBill.findOne({
                    where: { id: req.query.id }
                })
                if (!status) {
                    resolve({
                        message: 'Status id not found',
                        code: 0
                    })
                } else {
                    await db.StatusBill.destroy({
                        where: {
                            id: req.query.id,
                        }
                    })
                    resolve({
                        message: 'Successfully updated',
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
    getBill,
    createBill,
    deleteBill,
    updateBill,
    getStatus,
    createStatus,
    deleteStatus,
    updateStatus,
    updateStatusBill,
    getDetailBill,
    createBillSale,

}
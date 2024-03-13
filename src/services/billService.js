import db from '../models'
import joi from 'joi'
import { id, idStatus, idBuyer, idShop, idAddress, idDeliver, idPayment, totalPrice, products, status } from '../helpers/joi_schema'
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
                            model:db.StatusBill, as: 'status', attributes: ['status']
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
                            model:db.StatusBill, as: 'status', attributes: ['status']
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
                            model: db.Shop, as: 'shop', attributes: ['name']
                        },
                        {
                            model:db.StatusBill, as: 'status', attributes: ['status']
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
                            model: db.Product, as: 'product', attributes: ['name', 'price', 'mainImage']
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
                            model: db.Product, as: 'product', attributes: ['name', 'price', 'mainImage']
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
            const error = joi.object({ id, idBuyer, idShop, totalPrice, idAddress, idDeliver, idPayment, products }).validate(req.body);
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
                    let status = await db.BillStatus.findOne({
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
    updateStatusBill

}
import db from '../models/index'
import joi from 'joi'
import { id, remain, quantity, limit, description, minBill, maVoucher, start, end, type, salePT, salePrice } from '../helpers/joi_schema'


const getVoucher = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (req.query.id) {
                let data = await db.Voucher.findOne({
                    where: {
                        id: req.query.id
                    },
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['name', 'avatar','id']
                        }
                    ]
                })
                resolve({
                    data,
                    code: 1,
                    message: 'Successfully'
                })
            }
            const data = await db.Voucher.findAll({})
            resolve({
                data,
                code: 1,
                message: 'Successfully'
            })
        } catch (error) {
            reject(error)
        }
    })
}
const getVoucherOfShop = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (req.query.id) {
                if (req.user.role !== 'R1' && req.query.id !== String(req.user.id)) {
                    resolve({
                        message: 'Cannot find voucher',
                        code: 0
                    })
                }
                let data = await db.Shop.findOne({
                    where: {
                        id: req.query.id
                    },
                    include: [
                        {
                            model: db.Voucher, as: 'voucher', attributes: ['start', 'end', 'maVoucher', 'id', 'quantity', 'remain', 'limit', 'description', 'salePT', 'salePrice', 'minBill', 'type'],
                        }
                    ]
                })
                resolve({
                    data,
                    code: 1,
                    message: 'Successfully'
                })
            }
            const data = await db.Voucher.findAll()
            resolve({
                data,
                code: 1,
                message: 'Successfully'
            })
        } catch (error) {
            reject(error)
        }
    })
}
const createVoucher = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ maVoucher, description, end, start, quantity, limit, minBill, salePT, salePrice, type })
                .validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let voucher = await db.Voucher.create({
                    ...req.body,
                    remain: 0
                })
                await voucher.save()
                resolve({
                    code: 1,
                    message: 'Create new voucher successfully'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteVoucher = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let voucher = await db.Voucher.findOne({
                    where: {
                        id: req.body.id,
                    }
                })

                if (!voucher) {
                    resolve({
                        code: 0,
                        message: 'Voucher ID not found'
                    })
                } else {
                    await db.Voucher.destroy({
                        where: { id: req.body.id }
                    })
                    resolve({
                        code: 1,
                        message: `Voucher has id ${req.body.id} with code \'${voucher.maVoucher}\' deleted`
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
const updateVoucher = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, maVoucher, remain, description, end, start, quantity, limit, minBill, salePT, salePrice, type })
                .validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let voucher = await db.Voucher.findOne({
                    where: { id: req.body.id }
                })
                if (!voucher) {
                    resolve({
                        code: 0,
                        message: 'Voucher ID not found'
                    })
                } else {
                    if (req.body.salePrice) {
                        req.body.salePT = 0
                    } else if (req.body.salePT) {
                        req.body.salePrice = 0
                    }
                    await db.Voucher.update(req.body, {
                        where: { id: req.body.id }
                    })
                    resolve({
                        code: 1,
                        message: `Voucher has id ${req.body.id} with code \'${voucher.maVoucher}\' updated`
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getVoucher,
    createVoucher,
    deleteVoucher,
    updateVoucher,
    getVoucherOfShop
}
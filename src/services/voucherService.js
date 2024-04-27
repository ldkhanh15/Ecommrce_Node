import db from '../models/index'
import joi from 'joi'
import { id, quantity, description, idShop, maVoucher, start, end, type, salePT, salePrice } from '../helpers/joi_schema'
import { Op } from 'sequelize'

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
                            model: db.Shop, as: 'shop', attributes: ['name', 'avatar', 'id']
                        }
                    ]
                })
                resolve({
                    data,
                    code: 1,
                    message: 'Successfully'
                })
            }

            const data = await db.Voucher.findAll({

                include: [
                    {
                        model: db.Shop, as: 'shop', attributes: ['name', 'avatar', 'id']
                    }
                ]
            })
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

const getVoucherOfAll = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.Voucher.findAll({
                where: {
                    idShop: {
                        [Op.or]: [null, { [Op.eq]: 0 }]
                    }
                }
            })
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
            let data;
            let page = parseInt(req.query.page) || 1;
            let limit = 6;
            let offset = (page - 1) * limit;
            if (req.user.role === 'R2') {
                let shop = await db.Shop.findOne({
                    where: {
                        idUser: req.user.id,
                    }
                })
                if (!shop) {
                    resolve({
                        message: 'Shop not found',
                        code: 0
                    })
                } else {
                    data = await db.Voucher.findAndCountAll({
                        limit,
                        offset,
                        where: {
                            idShop: shop.id,
                        },
                        include: [
                            {
                                model: db.Shop, as: 'shop', attributes: ['name', 'avatar', 'id']
                            }
                        ]
                    })
                    resolve({
                        data: data.rows,
                        pages: Math.ceil(data.count / limit),
                        code: 1,
                        message: `Get voucher of ${shop.name} successfully`
                    })
                }
            }
            data = await db.Voucher.findAndCountAll({
                limit,
                offset,
                include: [
                    {
                        model: db.Shop, as: 'shop', attributes: ['name', 'avatar', 'id']
                    }
                ]
            })
            resolve({
                data: data.rows,
                pages: Math.ceil(data.count / limit),
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
            const error = joi.object({ maVoucher, description, end, start, quantity, salePT, salePrice, idShop })
                .validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let shop = await db.Shop.findOne({
                    where: {
                        idUser: req.user.id,
                    }
                })
                if (String(shop.id) !== req.body.idShop && req.user.role !== 'R1') {
                    resolve({
                        message: 'You cannot create a new voucher another shop',
                        code: 0
                    })
                }
                let voucher = await db.Voucher.create({
                    ...req.body,
                    remain: req.body.quantity
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
                        message: 'Voucher not found'
                    })
                } else {
                    await db.Voucher.destroy({
                        where: { id: req.body.id }
                    })
                    resolve({
                        code: 1,
                        message: `Voucher with code \'${voucher.maVoucher}\' deleted`
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
            const error = joi.object({ id, maVoucher, description, end, start, quantity, salePT, salePrice, idShop })
                .validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {

                let shop = await db.Shop.findOne({
                    where: {
                        idUser: req.user.id,
                    }
                })
                if (String(shop.id) !== req.body.idShop && req.user.role !== 'R1') {
                    resolve({
                        message: 'You cannot update voucher of another shop',
                        code: 0
                    })
                }

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
                        message: `Voucher with code \'${req.body.maVoucher}\' updated`
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
const getSearch = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let search = "";
            if (req.query.q) {
                search = req.query.q
            }
            let data = await db.Voucher.findAll({
                where: {
                    [Op.or]: [
                        { maVoucher: { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } },
                    ]
                },
                include: [
                    {
                        model: db.Shop, as: 'shop', attributes: ['name', 'avatar', 'id']
                    }
                ]
            })
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
module.exports = {
    getVoucher,
    createVoucher,
    deleteVoucher,
    updateVoucher,
    getVoucherOfShop,
    getVoucherOfAll,
    getSearch
}
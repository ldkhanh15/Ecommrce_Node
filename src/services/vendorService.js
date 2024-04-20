import db from '../models/index'
import joi from 'joi'
import { Op } from 'sequelize'
import { idDeliver, idShop, email, password, name, username, phone, bank, introduce, id, address } from '../helpers/joi_schema'
import cloudinary from 'cloudinary'

const getVendor = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            let page = parseInt(req.query.page) || 1;
            let limit = 5;
            let offset = (page - 1) * limit;
            if (req.query.id) {
                data = await db.Shop.findAll({
                    where: { idUser: req.query.id } ,
                    include: [
                        {
                            model: db.Bill, as: 'bill', attributes: ['totalPrice']
                        }
                    ]
                })
                resolve({
                    data,
                    code: 1,
                    message: 'Successfully'
                })
            } else {
                data = await db.Shop.findAndCountAll({
                    limit,
                    offset,
                    include: [
                        {
                            model: db.Bill, as: 'bill', attributes: ['totalPrice']
                        }
                    ]
                })
                resolve({
                    data: data.rows,
                    code: 1,
                    message: 'Successfully',
                    pages: Math.ceil(data.count / limit)
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getVendorAll = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            if (req.query.id) {
                data = await db.Shop.findOne({
                    where: {
                        id: req.query.id
                    },
                    include: [
                        {
                            model: db.Product, as: 'product', attributes: ['id', 'name', 'price', 'mainImage', 'hoverImage', 'sale', 'brand'],
                            include: [
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                }
                            ]
                        },
                    ],
                })
                resolve({
                    data,
                    code: 1,
                    message: 'Successfully'
                })
            } else {
                let page = parseInt(req.query.page) || 1;
                let limit = 10;
                let offset = (page - 1) * limit;
                data = await db.Shop.findAndCountAll({
                    offset,
                    limit,
                    distinct: true,
                    include: [
                        {
                            model: db.Product, as: 'product', attributes: ['name', 'price', 'mainImage', 'hoverImage', 'sale', 'brand'],
                            include: [
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                }
                            ]
                        },
                    ],
                })
                resolve({
                    data: data.rows,
                    pages: Math.ceil(data.count / limit),
                    count:data.count,
                    code: 1,
                    message:'Successfully',
                })
            }
          
        } catch (error) {
            reject(error)
        }
    })
}

const createVendor = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ email, password, name, username }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {

                let vendor = await db.Shop.create(req.body);
                if (!vendor) {
                    resolve({
                        code: 0,
                        message: 'Error creating vendor from server'
                    })
                } else {
                    await vendor.save();
                    resolve({
                        code: 1,
                        message: 'Create vendor successfully'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteVendor = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let vendor = await db.Shop.findOne({
                    where: {
                        id: req.query.id,
                    }
                });
                if (!vendor) {
                    resolve({
                        code: 0,
                        message: 'Vendor not found'
                    })
                } else {
                    if (vendor.fileName) {
                        await cloudinary.uploader.destroy(vendor.fileName)
                    }
                    await db.Shop.destroy({
                        where: { id: req.query.id }
                    })
                    resolve({
                        message: `Vendor has id ${req.query.id} deleted`,
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateVendor = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, name, username, phone, bank, introduce, address }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {

                let vendor = await db.Shop.findOne({
                    where: { id: req.body.id }
                })
                if (!vendor) {
                    resolve({
                        code: 0,
                        message: 'Vendor ID not found'
                    })
                } else {
                    await db.Shop.update(req.body, {
                        where: { id: req.body.id }
                    })
                    resolve({
                        code: 1,
                        message: `Vendor with  id ${req.body.id} has been updated`
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateAvatarVendor = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.body)
            if (error.error) {
                await cloudinary.uploader.destroy(req?.file?.filename)
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                if (req.file) {
                    req.body.avatar = req?.file?.path;
                    req.body.fileName = req.file?.filename;
                }

                let vendor = await db.Shop.findOne({
                    where: { id: req.body.id }
                })
                if (!vendor) {
                    await cloudinary.uploader.destroy(req?.file?.filename)
                    resolve({
                        code: 0,
                        message: 'Vendor not found'
                    })
                } else {
                    if (vendor.fileName) {
                        await cloudinary.uploader.destroy(vendor.fileName)
                    }
                    await db.Shop.update(req.body, {
                        where: { id: req.body.id }
                    })
                    resolve({
                        code: 1,
                        message: `Update avatar for vendor ${req.body.id} successfully`
                    })
                }
            }
        } catch (error) {
            await cloudinary.uploader.destroy(req?.file?.filename)
            reject(error)
        }
    })
}
const getDeliver = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let shop = await db.Shop.findOne({
                    where: {
                        idUser: req.query.id
                    }
                })
                if (!shop) {
                    resolve({
                        message: 'Shop not found',
                        code: 0
                    })
                } else {
                    if (String(req.user.id) !== shop.idUser && req.user.role !== 'R1') {
                        resolve({
                            message: 'You cannot access deliver of this shop',
                            code: 0
                        })
                    } else {
                        let data = await db.Shop.findOne({
                            where: { id: shop.id },
                            include: [
                                {
                                    model: db.Deliver, as: 'deliver', attributes: ['name', 'id']
                                }
                            ]
                        })
                        resolve({
                            message: 'Successfully',
                            code: 1,
                            data
                        })
                    }
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
const addDeliver = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ idDeliver, idShop }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let shop = await db.Shop.findOne({
                    where: {
                        idUser: req.body.idShop
                    }
                })
                if (!shop) {
                    resolve({
                        message: 'Shop not found',
                        code: 0
                    })
                } else {
                    if (String(req.user.id) !== shop.idUser && req.user.role !== 'R1') {
                        resolve({
                            message: 'You cannot add deliver to another shop',
                            code: 0
                        })
                    } else {
                        let checkDeliver = await db.ShopDeliver.findOne({
                            where: {
                                idDeliver: req.body.idDeliver,
                                idShop: shop.id
                            }
                        })
                        if (checkDeliver) {
                            resolve({
                                message: 'Deliver is already registered',
                                code: 0
                            })
                        } else {
                            let deliver = await db.Deliver.findOne({
                                where: { id: req.body.idDeliver }
                            })
                            if (!deliver) {
                                resolve({
                                    message: 'Cannot find delivery',
                                    code: 0
                                })
                            }
                            if (shop.idUser !== String(req.user.id) && req.user.role !== 'R1') {
                                resolve({
                                    message: 'You cannot add deliver another shop'
                                })
                            }

                            let deliverShop = await db.ShopDeliver.create({
                                idShop: shop.id,
                                idDeliver: req.body.idDeliver
                            })
                            await deliverShop.save();
                            resolve({
                                message: 'Add delivery successfully',
                                code: 1
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
const delDeliver = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ idShop, idDeliver }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let shop = await db.Shop.findOne({
                    where: { idUser: req.query.idShop }
                })
                if (!shop) {
                    resolve({
                        message: 'Shop not found',
                        code: 0
                    })
                }
                let shopDeliver = await db.ShopDeliver.findOne({
                    where: {
                        idShop: shop.id,
                        idDeliver: req.query.idDeliver
                    }
                })

                if (!shopDeliver) {
                    resolve({
                        message: 'Cannot find deliver shop',
                        code: 0
                    })
                } else {

                    if (shop.idUser !== String(req.user.id) && req.user.role !== 'R1') {
                        resolve({
                            message: 'You cannot add deliver another shop'
                        })
                    } else {
                        await db.ShopDeliver.destroy({
                            where: {
                                idShop: shop.id,
                                idDeliver: req.query.idDeliver
                            }
                        })
                        resolve({
                            message: `Deliver with id ${req.query.idDeliver} has been deleted`,
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
const getSearch = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let search = "";
            if (req.query.q) {
                search = req.query.q
            }
            let data = await db.Shop.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { username: { [Op.like]: `%${search}%` } },

                    ]
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
module.exports = {
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    updateAvatarVendor,
    addDeliver,
    delDeliver,
    getDeliver,
    getVendorAll,
    getSearch
}
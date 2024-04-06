import db from '../models/index'
import joi from 'joi'
import { Sequelize } from 'sequelize'
import { idDeliver, idShop, email, password, name, username, phone, bank, introduce, id, address } from '../helpers/joi_schema'
import cloudinary from 'cloudinary'

const getVendor = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Shop.findAll({
                where: req.query.id ? { id: req.query.id } : {},
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
        } catch (error) {
            reject(error)
        }
    })
}

const getVendorAll = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            if(req.query.id) {
                data = await db.Shop.findOne({
                    where:{
                        id: req.query.id
                    },
                    include: [
                        {
                            model: db.Product, as: 'product', attributes: ['id','name','price','mainImage','hoverImage','sale','brand'],
                            include:[
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                }
                            ]
                        },
                    ],
                })
            }else{
                data = await db.Shop.findAll({
                    include: [
                        {
                            model: db.Product, as: 'product', attributes: ['name','price','mainImage','hoverImage','sale','brand'],
                            include:[
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                }
                            ]
                        },
                    ],
                })
            }
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
                        message: 'Vendor ID not found'
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
                        message: 'Update vendor successfully'
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
                        message: 'Vendor ID not found'
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
                        message: 'Update vendor avatar successfully'
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
                let data = await db.Shop.findOne({
                    where: { id: req.query.id },
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
                let checkDeliver = await db.ShopDeliver.findOne({
                    where: {
                        idDeliver: req.body.idDeliver,
                        idShop: req.body.idShop
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
                    let shop = await db.Shop.findOne({
                        where: {
                            id: req.body.idShop
                        }
                    })
                    if (!shop || !deliver) {
                        resolve({
                            message: 'Cannot find delivery or shop',
                            code: 0
                        })
                    }
                    if (shop.idUser !== String(req.user.id) && req.user.role !== 'R1') {
                        resolve({
                            message: 'You cannot add deliver another shop'
                        })
                    }

                    let deliverShop = await db.ShopDeliver.create({
                        ...req.body
                    })
                    await deliverShop.save();
                    resolve({
                        message: 'Add delivery successfully',
                        code: 1
                    })
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
            console.log(req.query.id);
            const error = joi.object({ idShop, idDeliver }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let shopDeliver = await db.ShopDeliver.findOne({
                    where: {
                        idShop: req.query.idShop,
                        idDeliver: req.query.idDeliver
                    }
                })

                if (!shopDeliver) {
                    resolve({
                        message: 'Cannot find deliver shop',
                        code: 0
                    })
                } else {
                    let shop = await db.Shop.findOne({
                        where: { id: shopDeliver.idShop }
                    })
                    if (!shop) {
                        resolve({
                            message: 'Shop not found',
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
                                    idShop: req.query.idShop,
                                    idDeliver: req.query.idDeliver
                                }
                            })
                            resolve({
                                message: 'Successfully deleted',
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

module.exports = {
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    updateAvatarVendor,
    addDeliver,
    delDeliver,
    getDeliver,
    getVendorAll
}
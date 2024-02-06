import db from '../models/index'
import joi from 'joi'
import { email, password, name, username, phone, bank, introduce, id, address } from '../helpers/joi_schema'
import cloudinary from 'cloudinary'
const getVendor = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Shop.findAll({
                where: req.body.id ? { id: req.body.id } : {},
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
            const error = joi.object({ id }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let vendor = await db.Shop.findOne({
                    where: {
                        id: req.body.id,
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
                        where: { id: req.body.id }
                    })
                    resolve({
                        message: `Vendor has id ${req.body.id} deleted`,
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
                await cloudinary.uploader.destroy(req?.file?.filename)
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                req.body.avatar = req.file?.path
                req.body.fileName = req.file?.filename
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
            await cloudinary.uploader.destroy(req?.file?.filename)
            reject(error)
        }
    })
}


module.exports = {
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor
}
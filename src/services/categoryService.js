import db from '../models'
import { name, id, quantity, featured } from '../helpers/joi_schema'
import joi from 'joi'
import cloudinary from 'cloudinary'
import { Op } from 'sequelize'
const getCate = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = req.body;
            const error = joi.object({ featured }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let data = await db.Cate.findAll({
                    where: id ? {
                        id,
                        featured: req.query.featured === "true" ? true : false
                    } : {
                        featured: req.query.featured === "true" ? true : false
                    }
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

const getAllCate = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let page = parseInt(req.query.page) || 1;
            let limit = 5;
            let offset = (page - 1) * limit;
            let data = await db.Cate.findAndCountAll({
                offset,
                limit,
                attributes: { exclude: ['fileName'] },
            });
            resolve({
                data: data.rows,
                pages: Math.ceil(data.count / limit),
                message: 'Successfully',
                code: 1
            })

        } catch (error) {
            reject(error)
        }
    })
}

const uploadImage = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.body);
            if (error.error) {
                if (req.file) {
                    await cloudinary.uploader.destroy(req?.file?.filename)
                }
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let cate = await db.Cate.findOne({
                    where: { id: req.body.id }
                })
                if (!cate) {
                    if (req.file) {
                        await cloudinary.uploader.destroy(req?.file?.filename)
                    }
                    resolve({
                        code: 0,
                        message: 'Category not found'
                    })
                } else {
                    if (cate.fileName) {
                        await cloudinary.uploader.destroy(cate.fileName)
                    }
                    await db.Cate.update({
                        fileName: req?.file?.filename,
                        image: req?.file?.path
                    }, {
                        where: { id: req.body.id }
                    })
                    resolve({
                        message: 'Uploading image successfully',
                        code: 1,
                        image: req?.file?.path
                    })
                }
            }

        } catch (error) {
            if (req.file) {
                await cloudinary.uploader.destroy(req?.file?.filename)
            }
            reject(error)
        }
    })
}
const createCate = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let image = req?.file?.path
            let fileName = req?.file?.filename
            if (!fileName || !image) {
                await cloudinary.uploader.destroy(req?.file?.filename)
                resolve({
                    message: 'Image is required',
                    code: 0
                })
            }
            const error = joi.object({ name, featured }).validate(req.body)
            if (error.error) {
                await cloudinary.uploader.destroy(req?.file?.filename)
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                const cate = await db.Cate.create({
                    image,
                    fileName,
                    featured: req.body.featured === "true" ? true : false,
                    quantity: 0,
                    ...req.body
                })
                await cate.save();
                resolve({
                    message: 'Add new category successfully',
                    code: 1
                })
            }
        } catch (error) {
            await cloudinary.uploader.destroy(req?.file?.filename)
            reject(error)
        }
    })
}
const deleteCate = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let cate = await db.Cate.findOne({
                    where: { id: req.query.id }
                })
                if (!cate) {
                    resolve({
                        message: 'ID Category not found',
                        code: 0
                    })
                }
                if (cate.fileName) {
                    await cloudinary.uploader.destroy(cate.fileName)
                }
                await db.Cate.destroy({
                    where: { id: req.query.id }
                })

                resolve({
                    message: `Category with id ${req.query.id} has been deleted`,
                    code: 1
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateCate = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, name, quantity, featured }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let cate = await db.Cate.findOne({
                    where: { id: req.body.id }
                })
                if (!cate) {
                    resolve({
                        message: 'Category not found',
                        code: 0
                    })
                } else {

                    await db.Cate.update({
                        ...req.body,
                        featured: req.body.featured === "true" ? true : false,
                    }, {
                        where: { id: req.body?.id }
                    })
                    resolve({
                        message: `Category with id ${req.body?.id} has been updated`,
                        code: 1
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
            let data = await db.Cate.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
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
    getCate,
    deleteCate,
    createCate,
    updateCate,
    getAllCate,
    uploadImage,
    getSearch
}
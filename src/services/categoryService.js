import db from '../models'
import { name, id } from '../helpers/joi_schema'
import joi from 'joi'
import cloudinary from 'cloudinary'

const getCate = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = req.body;
            let data = await db.Cate.findAll({
                where: id ? { id } : {}
            })
            resolve({
                message: 'Successfully',
                data,
                code:1
            })
        } catch (error) {
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
                resolve({
                    message: 'Image is required',
                    code:0
                })
            }
            const error = joi.object({ name }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                const cate = await db.Cate.create({
                    image,
                    fileName,
                    name: req.body.name,
                })
                await cate.save();
                resolve({
                    message: 'Successfully',
                    code:1
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
            const error = joi.object({ id }).validate(req.body)
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
                        message: 'ID Category not found',
                        code: 0
                    })
                }
                if (cate.fileName) {
                    await cloudinary.uploader.destroy(cate.fileName)
                }
                await db.Cate.destroy({
                    where: { id: req.body.id }
                })

                resolve({
                    message: 'Deleted category successfully',
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
            let image = req?.file?.path
            let fileName = req?.file?.filename
            if (!fileName || !image) {
                resolve({
                    message: 'Image is required',
                    code: 0
                })
            }
            const error = joi.object({ id, name }).validate(req.body)
            if (error.error) {
                await cloudinary.uploader.destroy(req?.file?.filename)
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let cate = await db.Cate.findOne({
                    where: { id: req.body.id }
                })
                if (!cate) {
                    await cloudinary.uploader.destroy(req?.file?.filename)
                    resolve({
                        message: 'ID category not found',
                        code: 0
                    })
                } else {
                    if(cate.fileName){
                        await cloudinary.uploader.destroy(cate.fileName)
                    }
                    await db.Cate.update({
                        name: req.body?.name,
                        fileName,
                        image
                    }, {
                        where: { id: req.body?.id }
                    })
                    resolve({
                        message: 'Update category successfully',
                        code: 1
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
    getCate,
    deleteCate,
    createCate,
    updateCate,
}
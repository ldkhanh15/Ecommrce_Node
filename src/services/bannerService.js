import db from '../models'
import cloudinary from 'cloudinary'
import joi from 'joi'
import { id, start, end, title, subTitle, main } from '../helpers/joi_schema'
const getBanner = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('main',req.query);
            const error = joi.object({ main }).validate(req.query);
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let data = await db.Banner.findAll({
                    attributes: { exclude: ['fileName'] },
                    where:{
                        main: req.query.main ==="true" ? true : false
                    }
                });
                resolve({
                    data,
                    message: 'Successfully',
                    code: 1
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const createBanner = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let image = req.file?.path;
            let fileName = req.file?.filename
            if (!image || !fileName) {
                await cloudinary.uploader.destroy(req.file?.filename)
                resolve({
                    message: 'Image is required',
                    code: 0
                })
            }
            const error = joi.object({ start, end, title, subTitle, main }).validate(req.body);
            if (error.error) {
                await cloudinary.uploader.destroy(req.file?.filename)
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let banner = await db.Banner.create({
                    ...req.body,
                    image,
                    fileName
                })
                await banner.save();
                resolve({
                    message: 'Successfully',
                    code: 1
                })
            }
        } catch (error) {
            await cloudinary.uploader.destroy(req.file?.filename)
            reject(error)
        }
    })
}

const deleteBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(data)
            console.log(error);
            if (error.error) {

                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let banner = await db.Banner.findOne({ where: { id: data.id } })
                if (!banner) {
                    resolve({
                        message: 'ID Banner not found',
                        code: 0
                    })
                }
                if (banner.fileName) {
                    await cloudinary.uploader.destroy(banner.fileName)
                }
                await db.Banner.destroy({ where: { id: data.id } })
                resolve({
                    message: 'Successfully',
                    code: 1
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateBanner = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fileName = req.file?.filename;
            let image = req.file?.path;
            const error = joi.object({ id, start, end, title, subTitle, main}).validate(req.body);
            if (error.error) {
                await cloudinary.uploader.destroy(req.file?.filename);
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {

                let banner = await db.Banner.findOne({ where: { id: id } })
                if (!banner) {
                    await cloudinary.uploader.destroy(req.file?.filename)
                    resolve({
                        message: 'ID Banner not found',
                        code: 0
                    })
                }
                if (banner.fileName) {
                    await cloudinary.uploader.destroy(banner.fileName)
                }
                await db.Banner.update({ ...req.body }, {
                    where: { id: id }
                })
                resolve({
                    message: 'Update banner successfully',
                    code: 1
                })
            }
        } catch (error) {
            await cloudinary.uploader.destroy(req.file?.filename)
            reject(error)
        }
    })
}
module.exports = {
    getBanner,
    createBanner,
    deleteBanner,
    updateBanner,
}
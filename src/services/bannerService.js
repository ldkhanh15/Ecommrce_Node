import db from '../models'
import cloudinary from 'cloudinary'
import joi from 'joi'
import { id, start, end, description } from '../helpers/joi_schema'
const getBanner = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Banner.findAll();
            resolve({
                data,
                message: 'Successfully'
            })
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
                resolve({
                    message: 'Image is required',
                    code: 0
                })
            }
            const error = joi.object({ start, end, description }).validate(req.body);
            if (error.error) {
                await cloudinary.uploader.destroy(req.file?.filename)
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let { start, end, description } = req.body;
                let banner = await db.Banner.create({
                    start, end, description, image, fileName
                })
                await banner.save();
                resolve({
                    message: 'Successfully',
                    code:1
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
                if(banner.fileName){
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
            const error = joi.object({ id, start, end, description }).validate(req.body);
            if (error.error) {
                await cloudinary.uploader.destroy(req.file?.filename);
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {

                let { id, start, end, description } = req.body;
                let banner = await db.Banner.findOne({ where: { id: id } })
                if (!banner) {
                    await cloudinary.uploader.destroy(req.file?.filename)
                    resolve({
                        message: 'ID Banner not found'
                    })
                }
                if (banner.fileName) {
                    await cloudinary.uploader.destroy(banner.fileName)
                }
                await db.Banner.update({ start, end, description, fileName, image }, {
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
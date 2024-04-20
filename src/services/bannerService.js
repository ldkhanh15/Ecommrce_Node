import db from '../models'
import cloudinary from 'cloudinary'
import joi from 'joi'
import { id, start, end, title, subTitle, main } from '../helpers/joi_schema'
import { Op } from 'sequelize'
const getBanner = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ main }).validate(req.query);
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let data = await db.Banner.findAll({
                    attributes: { exclude: ['fileName'] },
                    where: {
                        main: req.query.main === "true" ? true : false
                    },
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
const getAllBanner = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let page = parseInt(req.query.page) || 1;
            let limit = 5;
            let offset = (page - 1) * limit;
            let data = await db.Banner.findAndCountAll({
                limit,
                offset,
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
                let banner = await db.Banner.findOne({
                    where: { id: req.body.id }
                })
                console.log(banner);
                if (!banner) {
                    if (req.file) {
                        await cloudinary.uploader.destroy(req?.file?.filename)
                    }
                    resolve({
                        code: 0,
                        message: 'Banner not found'
                    })
                } else {
                    if (banner.fileName) {
                        await cloudinary.uploader.destroy(banner.fileName)
                    }
                    await db.Banner.update({
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

const deleteBanner = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {

                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let banner = await db.Banner.findOne({ where: { id: req.query.id } })
                if (!banner) {
                    resolve({
                        message: 'ID Banner not found',
                        code: 0
                    })
                }
                if (banner.fileName) {
                    await cloudinary.uploader.destroy(banner.fileName)
                }
                await db.Banner.destroy({ where: { id: req.query.id } })
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

            const error = joi.object({ id, start, end, title, subTitle, main }).validate(req.body);
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {

                let banner = await db.Banner.findOne({ where: { id: req.body.id } })
                if (!banner) {
                    resolve({
                        message: 'ID Banner not found',
                        code: 0
                    })
                }
                await db.Banner.update({ ...req.body }, {
                    where: { id: req.body.id }
                })
                resolve({
                    message: 'Update banner successfully',
                    code: 1
                })
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
            let data = await db.Banner.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
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
    getBanner,
    getAllBanner,
    createBanner,
    deleteBanner,
    updateBanner,
    uploadImage,
    getSearch
}
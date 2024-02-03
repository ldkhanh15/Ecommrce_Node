import db from '../models'
import cloudinary from 'cloudinary'
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
            let { start, end, description } = req.body;
            let image = req.file.path;
            let fileName = req.file.filename
            if (start && end && description && image) {
                let banner = await db.Banner.create({
                    start, end, description, image, fileName
                })
                await banner.save();
                resolve({
                    message: 'Successfully'
                })
            }
            resolve({
                message: 'Missing parameters required'
            })
        } catch (error) {
            reject(error)
        }
    })
}

const deleteBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = data;
            if (!id) {
                resolve({
                    message: 'Missing id!!!'
                })
            }
            let banner = await db.Banner.findOne({ where: { id: id } })
            if (!banner) {
                resolve({
                    message: 'ID Banner not found'
                })
            }
            await cloudinary.uploader.destroy(banner.fileName)
            await db.Banner.destroy({ where: { id: id } })
            resolve({
                message: 'Successfully'
            })
        } catch (error) {
            reject(error)
        }
    })
}

const updateBanner = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id, start, end, description } = req.body;
            let fileName = req.file?.filename;
            let image = req.file?.path;
            if (!id || !start || !end || !description) {
                resolve({
                    message: 'Missing parameter required !!!'
                })
            }
            let banner = await db.Banner.findOne({ where: { id: id } })
            if (!banner) {
                resolve({
                    message: 'ID Banner not found'
                })
            }
            await cloudinary.uploader.destroy(banner.fileName)
            await db.Banner.update({ start, end, description, fileName, image }, {
                where: { id: id }
            })
            resolve({
                message: 'Successfully'
            })
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
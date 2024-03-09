import db from '../models/index'
import joi from 'joi'
import { id, idAuthor, name, field, comment, content } from '../helpers/joi_schema'
import cloudinary from 'cloudinary'
const getBlog = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Blog.findAll({
                where: req.body?.id ? { id: req.body.id } : {}
            });
            if (req.body.id) {
                await db.Blog.update({
                    view: data[0].view + 1
                }, {
                    where: { id: req.body.id }
                })
            }
            resolve({
                data,
                message: 'Successfully',
                code: 1
            })
        } catch (error) {
            reject(error)
        }
    })
}

const createBlog = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ idAuthor, name, field, comment, content }).validate(req.body);
            if (error.error) {
                await cloudinary.uploader.destroy(req?.file?.filename)
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                req.body.image = req.file?.path
                req.body.fileName = req.file?.filename
                let blog = await db.Blog.create({
                    ...req.body,
                    view: 0
                })
                await blog.save();

                let blogDetail = await db.BlogDetail.create({
                    ...req.body,
                    idBlog: blog.id,
                })
                await blogDetail.save();
                resolve({
                    message: 'Successfully create blog',
                    code: 1
                })
            }
        } catch (error) {
            await cloudinary.uploader.destroy(req?.file?.filename)
            reject(error)
        }
    })
}

const deleteBlog = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {

                let blog = await db.Blog.findOne({
                    where: { id: req.body.id }
                })
                if (!blog) {
                    resolve({
                        message: 'Blog id not found',
                        code: 0
                    })
                } else {
                    if (blog.fileName) {
                        await cloudinary.uploader.destroy(blog.fileName)
                    }
                    await db.BlogDetail.destroy({
                        where: {
                            idBlog: req.body.id
                        }
                    })
                    await db.Blog.destroy({
                        where: {
                            id: req.body.id
                        }
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateBlog = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, name, field, comment, content }).validate(req.body);
            if (error.error) {
                await cloudinary.uploader.destroy(req?.file?.filename)
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                req.body.image = req.file?.path
                req.body.fileName = req.file?.filename
                let blog = await db.Blog.findOne({
                    where: {
                        id: req.body.id
                    }
                })
                if (!blog) {
                    await cloudinary.uploader.destroy(req?.file?.filename)
                    resolve({
                        code: 0,
                        message: 'Blog id not found'
                    })
                } else {
                    if (blog.fileName) {
                        await cloudinary.uploader.destroy(blog.fileName)
                    }
                    await db.Blog.update({
                        ...req.body,
                        view: 100000
                    }, {
                        where: {
                            id: req.body.id
                        }
                    })
                    await db.BlogDetail.update(req.body, {
                        where: {
                            idBlog: req.body.id
                        }
                    })
                    resolve({
                        message: 'Update blog successfully',
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
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog,
}
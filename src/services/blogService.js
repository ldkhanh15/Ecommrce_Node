import db from '../models/index'
import { Op } from 'sequelize'
import joi from 'joi'
import { contentHTML, tag, idBlog, id, idAuthor, name, field, comment, content, star, idParent } from '../helpers/joi_schema'
import cloudinary from 'cloudinary'
const getBlog = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let page = parseInt(req.query.page) || 1;
            let limit = 12;
            let offset = (page - 1) * limit;
            let data = await db.Blog.findAndCountAll({
                limit,
                offset,
                include: [
                    {
                        model: db.User, as: 'author', attributes: ['name']
                    }
                ]
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
const getBlogAdmin = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            let page = parseInt(req.query.page) || 1;
            let limit = 5;
            let offset = (page - 1) * limit;
            if (req.user.role === 'R2') {
                data = await db.Blog.findAndCountAll({
                    limit,
                    offset,
                    where: {
                        idAuthor: req.user.id
                    },
                    include: [
                        {
                            model: db.User, as: 'author', attributes: ['name']
                        }
                    ]
                });
            } else if (req.user.role === 'R1') {
                data = await db.Blog.findAndCountAll({
                    limit,
                    offset,
                    include: [
                        {
                            model: db.User, as: 'author', attributes: ['name']
                        }
                    ]
                });
            }

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
const getBlogDetail = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Blog.findOne({
                where: { id: req.query.id },
                include: [
                    {
                        model: db.BlogDetail, as: 'detail', attributes: ['contentHTML', 'comment']
                    },
                    {
                        model: db.BlogComment, as: 'comment', attributes: ['id', 'idParent', 'comment', 'star', 'createdAt'],
                        include: [
                            {
                                model: db.User, as: 'user', attributes: ['name', 'avatar', 'username']
                            }
                        ]
                    },
                    {
                        model: db.Tag, as: 'tag', attributes: ['name']
                    },
                    {
                        model: db.User, as: 'author', attributes: ['name', 'avatar', 'createdAt'],
                    }
                ]
            });
            data.increment('view');

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
            const error = joi.object({ name, field, comment, content, tag, contentHTML }).validate(req.body);
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
                    view: 0,
                    idAuthor: req.user.id,
                })
                await blog.save();

                let blogDetail = await db.BlogDetail.create({
                    ...req.body,
                    idBlog: blog.id,

                })
                await blogDetail.save();
                req.body.tag.map(async (item) => {
                    let tag = await db.Tag.create({
                        idBlog: blog.id,
                        name: item
                    })
                    await tag.save();
                })
                resolve({
                    message: 'Blog has been posted successfully',
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
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {

                let blog = await db.Blog.findOne({
                    where: { id: req.query.id }
                })
                if (!blog) {
                    resolve({
                        message: 'Blog not found',
                        code: 0
                    })
                } else {
                    if (blog.fileName) {
                        await cloudinary.uploader.destroy(blog.fileName)
                    }
                    await db.BlogDetail.destroy({
                        where: {
                            idBlog: req.query.id
                        }
                    })
                    await db.Blog.destroy({
                        where: {
                            id: req.query.id
                        }
                    })
                    await db.Tag.destroy({
                        where: {
                            idBlog: req.query.id
                        }
                    })
                    resolve({
                        message: `Blog with id ${req.query.id} has been deleted`,
                        code: 1
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
            const error = joi.object({ id, name, field, comment, content, tag, contentHTML }).validate(req.body);
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let blog = await db.Blog.findOne({
                    where: {
                        id: req.body.id
                    }
                })
                if (!blog) {
                    resolve({
                        code: 0,
                        message: 'Blog not found'
                    })
                } else {
                    await db.Blog.update({
                        ...req.body,
                    }, {
                        where: {
                            id: req.body.id
                        }
                    })
                    await db.Tag.destroy({
                        where: {
                            idBlog: req.body.id
                        }
                    })
                    req.body.tag.map(async (item) => {
                        let tag = await db.Tag.create({
                            idBlog: blog.id,
                            name: item.name
                        })
                        await tag.save();
                    })
                    await db.BlogDetail.update(req.body, {
                        where: {
                            idBlog: req.body.id
                        }
                    })
                    resolve({
                        message: `Blog with id ${req.body.id} has been updated`,
                        code: 1
                    })
                }

            }
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
                        message: 'Blog not found'
                    })
                } else {
                    if (blog.fileName) {
                        await cloudinary.uploader.destroy(blog.fileName)
                    }
                    await db.Blog.update({
                        ...req.body,
                    }, {
                        where: {
                            id: req.body.id
                        }
                    })
                    resolve({
                        message: `Blog with id ${req.body.id}: one photo has been replaced`,
                        code: 1,
                        link: req.file.path
                    })
                }

            }
        } catch (error) {
            await cloudinary.uploader.destroy(req?.file?.filename)
            reject(error)
        }
    })
}

//COMMENT
const getComment = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query);
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let data = await db.Blog.findOne({
                    where: {
                        id: req.query.id
                    },
                    include: [
                        {
                            model: db.BlogComment, as: 'comment', attributes: ['idParent', 'comment', 'star'],
                            include: [
                                {
                                    model: db.User, as: 'user', attributes: ['avatar', 'name']
                                }
                            ]
                        }
                    ]
                })
                resolve({
                    message: 'Successfully get comment',
                    code: 1,
                    data
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
const createComment = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ idBlog, idAuthor, comment, idParent, star }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let comment = await db.BlogComment.create({
                    ...req.body
                });
                await comment.save();
                resolve({
                    code: 1,
                    message: `Comment has been posted`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteComment = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idBlog, }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let comment = await db.BlogComment.findOne({
                    where: {
                        idBlog: req.query.idBlog,
                        id: req.query.id
                    }
                })
                if (!comment) {
                    resolve({
                        message: 'Comment not found',
                        code: 0
                    })
                } else {
                    if (req.user.role !== "R1" && req.body.idAuthor !== String(req.user.id) || req.body.idAuthor !== comment.idAuthor) {
                        resolve({
                            message: `You cannot delete this comment`,
                            code: 0
                        })
                    }
                    await db.BlogComment.destroy({
                        where: {
                            idBlog: req.query.idBlog,
                            id: req.query.id
                        }
                    })
                    resolve({
                        code: 1,
                        message: `Comment with id ${req.query.id} has been deleted`
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateComment = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idBlog, idAuthor, comment, star }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let comment = await db.BlogComment.findOne({
                    where: {
                        idBlog: req.body.idBlog,
                        id: req.body.id
                    }
                })
                if (!comment) {
                    resolve({
                        message: 'Comment not found',
                        code: 0
                    })
                } else {

                    if (req.user.role !== "R1" && req.body.idAuthor !== String(req.user.id) || req.body.idAuthor !== comment.idAuthor) {
                        resolve({
                            message: 'You cannot modify this comment',
                            code: 0
                        })
                    }
                    await db.BlogComment.update(req.body, {
                        where: {
                            id: req.body.id
                        }
                    })
                    resolve({
                        code: 1,
                        message: `Comment with id ${req.body.id} has been modified`
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
            let data;
            if (req.user.role === 'R2') {
                data = await db.Blog.findAll({
                    where: {
                        [Op.or]: [
                            { name: { [Op.like]: `%${search}%` } },
                            { field: { [Op.like]: `%${search}%` } },
                        ],
                        idAuthor: req.user.id
                    },
                    include: [
                        {
                            model: db.User, as: 'author', attributes: ['name']
                        }
                    ]
                })
            } else if (req.user.role === 'R1') {
                data = await db.Blog.findAll({
                    where: {
                        [Op.or]: [
                            { name: { [Op.like]: `%${search}%` } },
                            { field: { [Op.like]: `%${search}%` } },
                        ]
                    },
                    include: [
                        {
                            model: db.User, as: 'author', attributes: ['name']
                        }
                    ]
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
module.exports = {
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog,
    getBlogDetail,
    getComment,
    createComment,
    deleteComment,
    updateComment,
    uploadImage,
    getBlogAdmin,
    getSearch
}
import db from '../models/index'
import joi from 'joi'
import { images, idUser, idParent, idProduct, idBill, star, comment, idBuyer, brand, color, combo, size, nameProduct, price, sale, id, idCate, additional, description, introduce, quantity } from '../helpers/joi_schema'
import cloudinary from 'cloudinary'
import { Op } from 'sequelize'
const getProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            let page = parseInt(req.query.page) || 1;
            let limit = 12;
            let offset = (page - 1) * limit;
            if (req.query.id) {
                data = await db.Product.findOne({
                    where: {
                        id: req.query.id
                    },
                    include: [
                        {
                            model: db.ProductDetail, as: 'detailProduct', attributes: ['additional', 'quantity', 'description']
                        },
                        {
                            model: db.Cate, as: 'cate', attributes: ['name']
                        },
                        {
                            model: db.ProductImage, as: 'image', attributes: ['link']
                        },
                        {
                            model: db.Color, as: 'color', attributes: ['name']
                        },
                        {
                            model: db.Size, as: 'size', attributes: ['name']
                        },
                        {
                            model: db.Combo, as: 'combo', attributes: ['name']
                        },
                        {
                            model: db.ProductReview, as: 'review', attributes: ['star']
                        }
                    ],
                })
                resolve({
                    data,
                    code: 1,
                    message: 'Successfully',
                })
            } else {

                data = await db.Product.findAndCountAll({
                    offset,
                    limit,
                    distinct: true,
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['id', 'name', 'username']
                        },
                        {
                            model: db.Cate, as: 'cate', attributes: ['name']
                        },
                        {
                            model: db.ProductImage, as: 'image', attributes: ['link']
                        },
                        {
                            model: db.ProductReview, as: 'review', attributes: ['star']
                        },
                        {
                            model: db.Color, as: 'color', attributes: ['name']
                        },
                        {
                            model: db.Size, as: 'size', attributes: ['name']
                        },
                        {
                            model: db.Combo, as: 'combo', attributes: ['name']
                        },
                    ]
                })
                resolve({
                    data: data.rows,
                    pages: Math.ceil(data.count / limit),
                    code: 1,
                    message: 'Successfully'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const getProductOfShop = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            let page = parseInt(req.query.page) || 1;
            let limit = 5;
            let offset = (page - 1) * limit;
            if (req.user.role === 'R2') {
                let shop = await db.Shop.findOne({
                    where: {
                        idUser: req.user.id
                    }
                })
                if (shop) {

                    data = await db.Product.findAndCountAll({
                        where: {
                            idShop: shop.id
                        },
                        limit,
                        offset,
                        include: [
                            {
                                model: db.ProductDetail, as: 'detailProduct', attributes: ['quantity'],
                            },
                            {
                                model: db.Shop, as: 'shop', attributes: ['name']
                            }
                        ]
                    })
                }
            } else if (req.user.role === 'R1') {
                data = await db.Product.findAndCountAll({
                    limit,
                    offset,
                    include: [
                        {
                            model: db.ProductDetail, as: 'detailProduct', attributes: ['quantity'],
                        },
                        {
                            model: db.Shop, as: 'shop', attributes: ['name']
                        }
                    ]
                });
            }

            resolve({
                data: data.rows,
                code: 1,
                message: 'Successfully',
                pages: Math.ceil(data.count / limit)
            })

        } catch (error) {
            reject(error)
        }
    })
}
const getProductShop = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let { id } = req.query;

                let data = await db.Product.findOne({
                    where: { id },
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['avatar', 'address', 'name', 'phone', 'introduce', 'avgStar', 'comment']
                        },
                    ]
                })
                resolve({
                    data,
                    code: 1,
                    message: 'Successfully'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getProductComment = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let { id } = req.query;
                let data = await db.ProductReview.findAll({
                    where: { idProduct: id },
                    include: [
                        {
                            model: db.User, as: 'user', attributes: ['name', 'avatar']
                        }
                    ]
                })
                resolve({
                    data,
                    code: 1,
                    message: 'Successfully'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const createProductComment = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ idBuyer, idBill, idProduct, comment, star, idParent }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error.details[0].message
                })
            } else {
                let review = await db.ProductReview.create({
                    ...req.body,
                    idUser: req.body.idBuyer
                })
                await review.save();
                let data = await db.Product.findAll({
                    where: {
                        id: req.body.idProduct
                    },
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['id']
                        }
                    ]
                })
                if (data && data[0].shop) {
                    let id = data[0].shop.id;
                    let shop = await db.Shop.findAll({
                        where: { id }
                    })

                    let comment = shop[0].comment + 1;
                    let avgStar = (shop[0].avgStar * shop[0].comment + parseInt(req.body.star)) / comment;

                    await db.Shop.update({
                        avgStar, comment
                    }, {
                        where: { id }
                    })
                    resolve({
                        code: 1,
                        message: 'Comment posted'
                    })
                } else {
                    resolve({
                        code: 0,
                        message: 'Cannot find shop'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateProductComment = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, comment, star }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error.details[0].message
                })
            } else {
                let commentProduct = await db.ProductReview.findOne({
                    where: { id: req.body.id }
                })
                if (!commentProduct) {
                    resolve({
                        message: 'Comment not found',
                        code: 0
                    })
                } else {

                    await db.ProductReview.update({
                        ...req.body
                    }, {
                        where: {
                            id: req.body.id
                        }
                    })
                    let product = await db.Product.findOne({
                        where: {
                            id: commentProduct.idProduct
                        },
                        include: [
                            {
                                model: db.Shop, as: 'shop', attributes: ['id']
                            }
                        ]
                    })
                    let shop = await db.Shop.findOne({
                        where: {
                            id: product.shop.id
                        }
                    })
                    let avgStar = shop.avgStar
                    let comment = shop.comment
                    avgStar = (comment * avgStar - commentProduct.star + parseFloat(req.body.star)) / (comment);

                    await db.Shop.update({
                        avgStar, comment
                    }, {
                        where: {
                            id: product.shop.id
                        }
                    })
                    resolve({
                        message: 'Updated comment successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteProductComment = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error.details[0].message
                })
            } else {
                let productComment = await db.ProductReview.findOne({
                    where: { id: req.query.id }
                })
                if (!productComment) {
                    resolve({
                        message: 'Comment not found',
                        code: 0
                    })
                } else {
                    let product = await db.Product.findOne({
                        where: {
                            id: productComment.idProduct
                        },
                        include: [
                            {
                                model: db.Shop, as: 'shop', attributes: ['id']
                            }
                        ]
                    })
                    await db.ProductReview.destroy({
                        where: {
                            id: req.query.id
                        }
                    })
                    let shop = await db.Shop.findOne({
                        where: {
                            id: product.shop.id
                        }
                    })
                    let avgStar = shop.avgStar
                    let comment = shop.comment
                    avgStar = (comment * avgStar - productComment.star) / (comment - 1);
                    comment--;
                    await db.Shop.update({
                        avgStar, comment
                    }, {
                        where: {
                            id: product.shop.id
                        }
                    })

                    resolve({
                        message: `Comment of product with id ${product.id} has been deleted`,
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const createProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ color, combo, size, description, additional, introduce, idCate, nameProduct, price, sale, quantity, brand }).validate(req.body)
            if (error.error) {
                Promise.all(req.files?.map(async (file) => {
                    await cloudinary.uploader.destroy(file.filename)
                }))
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let cate = await db.Cate.findOne({
                    where: { id: req.body.idCate }
                })
                cate.increment("quantity")
                let shop = await db.Shop.findOne({
                    where: {
                        idUser: req.user.id
                    }
                })
                let product = await db.Product.create({
                    ...req.body,
                    idShop: shop.id || req.user.id,
                    sold: 0,
                    name: req.body.nameProduct,
                    mainImage: req.files[0].path,
                    hoverImage: req.files[1].path
                })
                await product.save();
                Promise.all(req.files?.map(async (file) => {
                    let image = await db.ProductImage.create({
                        idProduct: product.id,
                        link: file.path,
                        fileName: file.filename
                    })
                    await image.save();
                }))

                let productDetail = await db.ProductDetail.create({
                    additional: req.body.additional,
                    description: req.body.description,
                    quantity: req.body.quantity,
                    idProduct: product.id
                })
                await productDetail.save()
                req.body.size && Promise.all(req.body.size.map(async (item) => {
                    let sizeItem = await db.ProductSize.create({
                        idProduct: product.id,
                        idSize: item
                    })
                    await sizeItem.save()
                }))
                req.body.combo && Promise.all(req.body.combo.map(async (item) => {
                    let comboItem = await db.Combo.create({
                        idProduct: product.id,
                        name: item
                    })
                    await comboItem.save()
                }))
                req.body.color && Promise.all(req.body.color.map(async (item) => {
                    let colorItem = await db.Color.create({
                        idProduct: product.id,
                        name: item
                    })
                    await colorItem.save()
                }))
                resolve({
                    message: 'Add new product successfully',
                    code: 1
                })
            }

        } catch (error) {
            Promise.all(req.files?.map(async (file) => {
                await cloudinary.uploader.destroy(file.filename)
            }))
            reject(error)
        }
    })
}

const updateProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, brand, color, combo, size, description, additional, introduce, idCate, nameProduct, price, sale, quantity }).validate(req.body)
            if (error.error) {
                Promise.all(req?.files?.map(async (file) => {
                    await cloudinary.uploader.destroy(file.filename)
                }))
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let product = await db.Product.findOne({
                    where: {
                        id: req.body.id
                    }
                })
                if (!product) {
                    Promise.all(req?.files?.map(async (file) => {
                        await cloudinary.uploader.destroy(file.filename)
                    }))
                    resolve({
                        code: 0,
                        message: 'Product not found'
                    })
                } else {
                    let images = await db.ProductImage.findAll({
                        where: {
                            idProduct: req.body.id,
                        },
                        raw: true
                    })
                    Promise.all(
                        images.map(async (image) => {
                            await cloudinary.uploader.destroy(image.fileName)
                        })
                    )
                    await db.ProductImage.destroy({
                        where: {
                            idProduct: req.body.id
                        }
                    })
                    await db.ProductDetail.update({
                        additional: req.body.additional,
                        description: req.body.description,
                        quantity: req.body.quantity,
                    }, {
                        where: {
                            idProduct: product.id
                        }
                    })
                    await db.ProductSize.destroy({
                        where: {
                            idProduct: req.body.id
                        }
                    })
                    await db.Combo.destroy({
                        where: {
                            idProduct: req.body.id
                        }
                    })
                    await db.Color.destroy({
                        where: {
                            idProduct: req.body.id
                        }
                    })

                    await db.Product.update({
                        ...req.body,
                        sold: 0,
                        name: req.body.nameProduct,
                        mainImage: req?.files[0]?.path,
                        hoverImage: req?.files[1]?.path || req?.files[0]?.path,
                    }, {
                        where: {
                            id: req.body.id
                        }
                    })
                    Promise.all(req?.files?.map(async (file) => {
                        let image = await db.ProductImage.create({
                            idProduct: product.id,
                            link: file.path,
                            fileName: file.filename
                        })
                        await image.save();
                    }))

                    req.body.size && Promise.all(req.body.size.map(async (item) => {
                        let size = await db.Size.findOne({
                            where: {
                                name: item
                            }
                        })
                        let sizeItem = await db.ProductSize.create({
                            idProduct: product.id,
                            idSize: size.id
                        })
                        await sizeItem.save()
                    }))
                    req.body.combo && Promise.all(req.body.combo.map(async (item) => {
                        let comboItem = await db.Combo.create({
                            idProduct: product.id,
                            name: item
                        })
                        await comboItem.save()
                    }))
                    req.body.color && Promise.all(req.body.color.map(async (item) => {
                        let colorItem = await db.Color.create({
                            idProduct: product.id,
                            name: item
                        })
                        await colorItem.save()
                    }))
                    resolve({
                        message: `Product with id ${product.id} has been updated`,
                        code: 1
                    })
                }
            }

        } catch (error) {
            Promise.all(req?.files?.map(async (file) => {
                await cloudinary.uploader.destroy(file.filename)
            }))
            reject(error)
        }
    })
}


const deleteProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let product = await db.Product.findOne({
                    where: { id: req.query.id }
                })
                if (!product) {
                    resolve({
                        message: 'Product not found',
                        code: 0
                    })
                } else {
                    let images = await db.ProductImage.findAll({
                        where: { idProduct: req.query.id },
                    })
                    Promise.all(images.map(async (image) => {
                        await cloudinary.uploader.destroy(image.fileName)
                    }))
                    await db.ProductImage.destroy({
                        where: { idProduct: req.query.id },
                    })
                    await db.ProductDetail.destroy({
                        where: { idProduct: req.query.id },
                    })
                    await db.Product.destroy({
                        where: {
                            id: req.query.id
                        }
                    })
                    await db.ProductSale.destroy({
                        where: {
                            id: req.query.id
                        }
                    })
                    await db.ProductReview.destroy({
                        where: { id: req.query.id }
                    })
                    await db.Color.destroy({
                        where: {
                            idProduct: req.query.id
                        }
                    })
                    await db.ProductSize.destroy({
                        where: {
                            idProduct: req.query.id
                        }
                    })
                    await db.Combo.destroy({
                        where: {
                            idProduct: req.query.id
                        }
                    })


                }
                resolve({
                    message: `Product with id ${req.query.id} has been deleted`,
                    code: 1
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
const likeProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ idUser, idProduct }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: req.body.idUser }
                })
                let product = await db.Product.findOne({
                    where: { id: req.body.idProduct }
                })

                if (!product || !user) {
                    resolve({
                        message: 'Not found',
                        code: 0
                    })
                } else {
                    let like = await db.UserProduct.create({
                        ...req.body
                    })
                    await like.save()
                    resolve({
                        message: 'Liked this product',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const unlikeProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idUser, idProduct }).validate(req.body)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                if (req.user.role !== 'R1' && req.body.idUser !== String(req.user.id)) {
                    resolve({
                        message: 'You cannot unlike this product',
                        code: 0
                    })
                } else {

                    let like = await db.UserProduct.findOne({
                        where: {
                            id: req.body.id
                        }
                    })
                    if (!like) {
                        resolve({
                            message: 'You don\'t like this product',
                            code: 0
                        })
                    } else {
                        await db.UserProduct.destroy({
                            where: { id: req.body.id }
                        })
                        resolve({
                            message: 'Unlike this product',
                            code: 1
                        })
                    }
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
            let data = await db.Product.findAll({
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
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductComment,
    getProductShop,
    createProductComment,
    deleteProductComment,
    updateProductComment,
    likeProduct,
    unlikeProduct,
    getProductOfShop,
    getSearch
}
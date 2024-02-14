import db from '../models/index'
import joi from 'joi'
import { color, combo, size, nameProduct, price, sale, id, idCate, additional, description, introduce, quantity } from '../helpers/joi_schema'
import cloudinary from 'cloudinary'

const getProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = !req.body.id ?
                await db.Product.findAll({
                    include: [
                        {
                            model: db.ProductDetail, as: 'detailProduct', attributes: ['additional', 'brand', 'quantity']
                        },
                        {
                            model: db.Shop, as: 'shop', attributes: ['name', 'avatar', 'address', 'phone', 'introduce']
                        },
                        {
                            model: db.Cate, as: 'cate', attributes: ['name']
                        },
                        {
                            model: db.ProductImage, as: 'image', attributes: ['link']
                        },
                        {
                            model: db.ProductReview, as: 'review', attributes: ['star']
                        }
                    ],
                })
                :
                await db.Product.findOne({
                    where: {
                        id: req.body.id
                    },
                    include: [
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
                    ],
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
const createProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ color, combo, size, description, additional, introduce, idCate, nameProduct, price, sale, quantity }).validate(req.body)
            if (error.error) {
                Promise.all(req.files?.map(async (file) => {
                    await cloudinary.uploader.destroy(file.filename)
                }))
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {

                let product = await db.Product.create({
                    ...req.body,
                    sold: 0,
                    name: req.body.nameProduct,
                    mainImage: req.files[0].path,
                    hoverImage: req.files[1].path,
                    idShop: req.user.id
                })
                await product.save();
                Promise.all(req.files?.map(async (file, index) => {
                    let image = await db.ProductImage.create({
                        idProduct: product.id,
                        link: file.path,
                        fileName: file.filename
                    })
                    await image.save();
                }))

                let productDetail = await db.ProductDetail.create({
                    ...req.body,
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
                    message: 'Successfully',
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
            const error = joi.object({ id, color, combo, size, description, additional, introduce, idCate, nameProduct, price, sale, quantity }).validate(req.body)
            if (error.error) {
                Promise.all(req.files?.map(async (file) => {
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
                    Promise.all(req.files?.map(async (file) => {
                        await cloudinary.uploader.destroy(file.filename)
                    }))
                    resolve({
                        code: 0,
                        message: 'Product ID not found'
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
                    await db.ProductDetail.destroy({
                        where: {
                            idProduct: req.body.id
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
                        mainImage: req.files[0].path,
                        hoverImage: req.files[1].path,
                    }, {
                        where: {
                            id: req.body.id
                        }
                    })
                    Promise.all(req.files?.map(async (file) => {
                        let image = await db.ProductImage.create({
                            idProduct: product.id,
                            link: file.path,
                            fileName: file.filename
                        })
                        await image.save();
                    }))

                    let productDetail = await db.ProductDetail.create({
                        ...req.body,
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
                        message: 'Successfully',
                        code: 1
                    })
                }
            }

        } catch (error) {
            Promise.all(req.files?.map(async (file) => {
                await cloudinary.uploader.destroy(file.filename)
            }))
            reject(error)
        }
    })
}


const deleteProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let product = await db.Product.findOne({
                    where: { id: req.body.id }
                })
                if (!product) {
                    resolve({
                        message: 'Product id not found',
                        code: 0
                    })
                } else {
                    let images = await db.ProductImage.findAll({
                        where: { idProduct: req.body.id },
                    })
                    Promise.all(images.map(async (image) => {
                        await cloudinary.uploader.destroy(image.fileName)
                    }))
                    await db.ProductImage.destroy({
                        where: { idProduct: req.body.id },
                    })
                    await db.ProductDetail.destroy({
                        where: { idProduct: req.body.id },
                    })
                    await db.Product.destroy({
                        where: {
                            id: req.body.id
                        }
                    })
                    await db.ProductSale.destroy({
                        where: {
                            id: req.body.id
                        }
                    })
                    await db.ProductReview.destroy({
                        where: { id: req.body.id }
                    })
                    await db.Color.destroy({
                        where: {
                            idProduct: req.body.id
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


                }
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




module.exports = {
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
}
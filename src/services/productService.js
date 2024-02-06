import db from '../models/index'

const getProduct = ({ id }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                id = ''
            }
            let data = await db.Product.findAll({
                where: { id },
                include: [
                    {
                        model: db.ProductDetail, as: 'detailProduct', attributes: ['description'],
                        include: [
                            {
                                model: db.Trademark, as: 'brand', attributes: ['name']
                                //id danh mục brand
                            },
                            {
                                model: db.CateSub, as: 'cate', attributes: ['name'],
                                //id danh mục con
                                include: [
                                    {
                                        model: db.CateParent, as: 'parent', attributes: ['name']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: db.ProductImage, as: 'image', attributes: ['link']
                        //link ảnh
                    },
                    {
                        model: db.ProductReview, as: 'review', attributes: ['comment']
                        //comment
                    },
                    {
                        model: db.Shop, as: 'shop', attributes: ['name']
                        //id shop
                    }
                ]
            });
            resolve({ data })


        } catch (error) {
            reject(error)
        }
    })
}
const createProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, mainImage, price, idShop, idBrand, idCate, description, from, comment, image } = data

            const product = await db.Product.create({
                name, mainImage, price, idShop
            })
            await product.save();
            const productDetail = await db.ProductDetail.create({
                idProduct: product.id,
                idBrand,
                idCate,
                description,
                from
            })
            await productDetail.save();
            const commentProduct = await db.ProductReview.create({
                comment,
                idProduct: product.id
            })
            await commentProduct.save()
            image.map(async (item) => {
                let imageProduct = await db.ProductImage.create({
                    link: item,
                    idProduct: product.id
                })
                await imageProduct.save();
            })
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}






//size
const getSize = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Size.findAll();
            resolve({
                message: 'Successfully',
                code: 1,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}
const createSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name } = data;
            if (name) {
                const size = await db.Size.create(data)
                await size.save();
                resolve({
                    message: 'Successfully',
                    code: 1,
                })
            }
            resolve({
                message: 'Missing name size!',
                code: 0
            })
        } catch (error) {
            reject(error)
        }
    })
}
const deleteSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = data;
            if (id) {
                await db.Size.destroy({
                    where: { id }
                })
                resolve({
                    message: 'Successfully',
                    errCode: 1,
                })
            }
            resolve({
                errMessage: 'Missing id size!',
                errCode: 2
            })
        } catch (error) {
            reject(error)
        }
    })
}
const updateSize = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, name } = data;
            if (id && name) {
                await db.Size.update({ name: name }, {
                    where: { id }
                })
                resolve({
                    message: 'Successfully',
                    errCode: 1,
                })
            }
            resolve({
                errMessage: 'Missing id size or name size!',
                errCode: 2
            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getProduct,
    createProduct,
    getSize,
    createSize,
    deleteSize,
    updateSize

}
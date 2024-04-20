import db from '../models'
import joi from 'joi'
import { Op } from 'sequelize'
import { type, id, idStatus, idProduct, idBuyer, idShop, idAddress, idDeliver, idPayment, totalPrice, products, status, idVoucher } from '../helpers/joi_schema'
const getBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Bill.findAll({
                where: {
                    idBuyer: req.user.id
                },
                include: [
                    {
                        model: db.StatusBill, as: 'status', attributes: ['status']
                    },
                    {
                        model: db.AddressUser, as: 'address', attributes: ['address']
                    },
                    {
                        model: db.Product, as: 'product', attributes: ['name', 'mainImage', 'price', 'sale'],
                        include: [
                            {
                                model: db.Shop, as: 'shop', attributes: ['name', 'id']
                            },
                            {
                                model: db.ProductReview, as: 'review', attributes: ['star']
                            }
                        ]
                    },
                    {
                        model: db.Deliver, as: 'deliver', attributes: ['name']
                    },
                    {
                        model: db.Payment, as: 'payment', attributes: ['name']
                    }
                ]
            })

            resolve({
                message: 'Successfully',
                data,
                code: 1
            })
        } catch (error) {
            reject(error)
        }
    })
}
const getBillDashboard = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            let page = parseInt(req.query.page) || 1; 
            let limit = 5;
            let offset = (page - 1) * limit;
            if (req.user.role === 'R1') {
                data = await db.Bill.findAndCountAll({
                    limit,
                    offset,
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['name']
                        },
                        {
                            model: db.StatusBill, as: 'status', attributes: ['status']
                        }
                    ]
                })
            } else if (req.user.role === 'R2') {
                let shop = await db.Shop.findOne({
                    where:{
                        idUser: req.user.id
                    }
                })
                data = await db.Bill.findAndCountAll({
                    where: {
                        idShop: shop.id
                    },
                    limit,
                    offset,
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['name']
                        },
                        {
                            model: db.StatusBill, as: 'status', attributes: ['status']
                        }
                    ]
                })
            }
            resolve({
                message: 'Successfully',
                data:data.rows,
                code: 1,
                pages: Math.ceil(data.count / limit)
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let data = await db.Bill.findOne({
                    where: {
                        id: req.query.id,
                    },
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['id', 'name', 'avatar', 'phone', 'address']
                        },
                        {
                            model: db.User, as: 'user', attributes: ['name', 'avatar', 'phone']
                        },
                        {
                            model: db.Product, as: 'product', attributes: ['id', 'name', 'price', 'sale', 'mainImage'],
                            include: [
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                }
                            ]
                        },
                        {
                            model: db.StatusBill, as: 'status', attributes: ['status']
                        },
                        {
                            model: db.AddressUser, as: 'address', attributes: ['address']
                        },
                        {
                            model: db.Payment, as: 'payment', attributes: ['name']
                        },
                        {
                            model: db.Deliver, as: 'deliver', attributes: ['name', 'price']
                        }
                    ]
                })
                resolve({
                    message: 'Successfully',
                    data,
                    code: 1
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
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {

                let data = await db.Bill.findOne({
                    where: {
                        id: req.query.id,
                    },
                    include: [
                        {
                            model: db.Shop, as: 'shop', attributes: ['id', 'name', 'avatar', 'phone', 'address']
                        },
                        {
                            model: db.User, as: 'user', attributes: ['name', 'avatar', 'phone']
                        },
                        {
                            model: db.Product, as: 'product', attributes: ['id', 'name', 'price', 'sale', 'mainImage'],
                            include: [
                                {
                                    model: db.ProductReview, as: 'review', attributes: ['star']
                                }
                            ]
                        },
                        {
                            model: db.StatusBill, as: 'status', attributes: ['status']
                        },
                        {
                            model: db.AddressUser, as: 'address', attributes: ['address']
                        },
                        {
                            model: db.Payment, as: 'payment', attributes: ['name']
                        },
                        {
                            model: db.Deliver, as: 'deliver', attributes: ['name', 'price']
                        }
                    ]
                })
                let productsInBill = data.product;
                let productReview;
                if (data) {
                    if (String(req.user.id) !== data?.idBuyer && req.user.role !== 'R1') {
                        resolve({
                            message: 'Cannot get bill of another customer',
                            code: 0
                        })
                    }
                    productReview = await db.ProductReview.findAll({
                        where: {
                            idBill: data.id,
                            idUser: data.idBuyer
                        }
                    })
                    let productsWithoutReview = productsInBill.filter(product => {
                        return !productReview.some(review => review.idProduct === String(product.id));
                    });
                    let newData = JSON.parse(JSON.stringify(data));
                    newData.product = [...productsWithoutReview];

                    resolve({
                        message: 'Successfully',
                        data: newData,
                        code: 1
                    })
                } else {
                    resolve({
                        message: 'Bill not found',
                        code: 0
                    })
                }


            }
        } catch (error) {
            reject(error)
        }
    })
}


const createBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({
                idBuyer, idAddress, idDeliver, idPayment, products, idVoucher
            }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {
                let { idVoucher, products, idBuyer, idAddress, idDeliver, idPayment } = req.body
                if (products.length === 0) {
                    resolve({
                        message: 'Please select products',
                        code: 0
                    })
                }
                var productsByShop = {};
                let voucher = await db.Voucher.findOne({
                    where: { id: idVoucher, }
                })

                for (var i = 0; i < products.length; i++) {
                    var product = products[i];
                    var idShop = product.idShop;

                    if (productsByShop[idShop]) {
                        productsByShop[idShop].push(product);
                    } else {
                        productsByShop[idShop] = [product];
                    }
                }


                if (req.user.role !== 'R1' && String(req.user.id) != idBuyer) {
                    resolve({
                        code: 1,
                        message: 'You can\'t pay other people\'s bills.'
                    })
                    return;
                } else {
                    let remain = 0;
                    if (voucher) {
                        remain = voucher.salePrice
                    }
                    for (var idShop in productsByShop) {

                        let bill = await db.Bill.create({
                            idBuyer,
                            idAddress,
                            idDeliver,
                            idPayment,
                            idShop,
                            idStatus: 1
                        })

                        let totalPrice = 0;
                        let totalDiscount = 0;
                        if (bill) {
                            await Promise.all(productsByShop[idShop]?.map(async (product) => {
                                let existProduct = await db.ProductDetail.findOne({
                                    where: {
                                        idProduct: product.id
                                    }
                                })

                                let voucherProduct = await db.Voucher.findOne({
                                    where: {
                                        id: product?.voucher?.id || 0
                                    }
                                })
                                if (existProduct && existProduct.quantity > product.quantity) {
                                    await db.ProductDetail.update({
                                        quantity: existProduct.quantity - product.quantity
                                    }, {
                                        where: {
                                            id: existProduct.id
                                        }
                                    })
                                    let discount = 0;

                                    if (voucherProduct && voucherProduct.remain > 0) {
                                        if (product.voucher.salePT) {
                                            discount = (product.sale !== 0 ? product.sale : 1) * product.price * product.quantity * product.voucher.salePT / 100
                                        } else if (product.voucher.salePrice) {
                                            discount = (product.sale !== 0 ? product.sale : 1) * product.price * product.quantity - product.voucher.salePrice > 0 ? product.voucher.salePrice : product.price * product.quantity * (product.sale !== 0 ? product.sale : 1)
                                        }
                                        await db.Voucher.update({
                                            remain: voucherProduct.remain - 1,
                                        }, {
                                            where: {
                                                id: product.voucher.id,
                                            }
                                        })
                                    }
                                    totalPrice += product.price * product.quantity * (product.sale !== 0 ? (100 - product.sale) / 100 : 1);
                                    totalDiscount += product.price * product.quantity * (product.sale !== 0 ? (100 - product.sale) / 100 : 1) - discount;
                                    let BP = await db.BillProduct.create({
                                        idBill: bill.id,
                                        idProduct: product.id,
                                        quantity: product.quantity,
                                        type: product.type,
                                        discount
                                    })
                                    await BP.save()

                                } else {
                                    resolve({
                                        message: 'Product not found or this product out stock',
                                        code: 0
                                    })
                                }
                            }))
                            bill.totalPrice = totalPrice;
                            if (remain > 0) {
                                if (voucher.salePrice) {
                                    if (remain > 0) {
                                        bill.discountPrice = totalDiscount - remain > 0 ? remain : totalDiscount;
                                        remain -= totalDiscount;
                                    }
                                } else if (voucher.salePT) {
                                    bill.discountPrice = totalDiscount * voucher.salePT / 100
                                }
                            }
                            if (voucher) {
                                await db.Voucher.update({
                                    remain: voucher.remain - 1
                                }, {
                                    where: {
                                        id: idVoucher
                                    }
                                })
                            }
                        }
                        await bill.save();
                    }
                    resolve({
                        message: 'Checkout successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const createBillSale = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({
                type, idBuyer, idShop, totalPrice, idAddress, idDeliver, idPayment, idProduct
            }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {

                let { type, idProduct, idBuyer, idShop, totalPrice, idAddress, idDeliver, idPayment } = req.body
                if (req.user.role !== 'R1') {

                    if (req.user.id != idBuyer) {
                        resolve({
                            code: 1,
                            message: 'You can\'t pay other people\'s bills.'
                        })
                        return;
                    }
                }
                let bill = await db.Bill.create({
                    idBuyer,
                    idShop,
                    totalPrice,
                    idAddress,
                    idDeliver,
                    idPayment,
                    idStatus: 1
                })
                await bill.save()

                if (bill) {
                    let product = await db.Product.findOne({
                        where: {
                            id: idProduct
                        }
                    })
                    if (!product) {
                        resolve({
                            message: 'Product not found',
                            code: 0
                        })
                    } else {

                        let BP = await db.BillProduct.create({
                            idBill: bill.id,
                            idProduct: idProduct,
                            quantity: 1,
                            type: type
                        })
                        await BP.save()
                    }

                }
                resolve({
                    message: `Purchase order ${bill.id} successfully.`,
                    code: 1,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let bill = await db.Bill.findOne({
                    where: {
                        id: req.query.id
                    }
                })
                if (!bill) {
                    resolve({
                        code: 0,
                        message: 'Order do not exist.'
                    })
                } else {

                    await db.BillProduct.destroy({
                        where: {
                            idBill: bill.id,
                        }
                    })
                    await db.Bill.destroy({
                        where: { id: bill.id }
                    })

                    resolve({
                        code: 1,
                        message: `Order with id ${bill.id} deleted successfully`
                    })
                }


            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, totalPrice, products }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let bill = await db.Bill.findOne({
                    where: {
                        id: req.body?.id
                    }
                })
                if (!bill) {
                    resolve({
                        code: 0,
                        message: 'Order not found'
                    })
                }
                await db.Bill.update(req.body, {
                    where: { id: req.body.id }
                })
                req.body?.products.map(async (product) => {

                    await db.BillProduct.update({ quantity: product.quantity }, {
                        where: {
                            idBill: req.body.id,
                            idProduct: product.id
                        }
                    })

                })

                resolve({
                    code: 1,
                    message: `Order has id ${req.body.id} updated successfully`
                })

            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateStatusBill = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idStatus }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {
                let bill = await db.Bill.findOne({
                    where: {
                        id: req.body.id,
                    }
                })
                if (!bill) {
                    resolve({
                        message: 'Order not found',
                        code: 0
                    })
                } else {
                    let status = await db.StatusBill.findOne({
                        where: {
                            id: req.body.idStatus,
                        }
                    })
                    if (!status) {
                        resolve({
                            message: 'status not found',
                            code: 0
                        })
                    } else {

                        await db.Bill.update(req.body, {
                            where: { id: req.body.id }
                        })
                        resolve({
                            message: `Order status with id ${req.body.id} has been updated`,
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

const getStatus = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.StatusBill.findAll();
            resolve({
                message: 'Successfully',
                code: 1,
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}
const createStatus = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ status }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {
                let status = await db.StatusBill.create({
                    ...req.body
                })
                await status.save();
                resolve({
                    message: 'Create new order status successfully',
                    code: 1
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateStatus = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, status }).validate(req.body);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {

                let status = await db.StatusBill.findOne({
                    where: { id: req.body.id }
                })
                if (!status) {
                    resolve({
                        message: 'Status not found',
                        code: 0
                    })
                } else {
                    await db.StatusBill.update(req.body, {
                        where: { id: status.id }
                    })
                    resolve({
                        message: `Order status with id ${status.id} has been updated`,
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteStatus = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query);
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0]?.message
                })
            } else {

                let status = await db.StatusBill.findOne({
                    where: { id: req.query.id }
                })
                if (!status) {
                    resolve({
                        message: 'Status id not found',
                        code: 0
                    })
                } else {
                    await db.StatusBill.destroy({
                        where: {
                            id: req.query.id,
                        }
                    })
                    resolve({
                        message: `Order status with id ${req.query.id} has been deleted`,
                        code: 1
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
           if(req.query.q){
            search = req.query.q
           }
           let data = await db.Bill.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },         
                ]
            }
          })
          resolve({
            data,
            code:1,
            message:'Successfully'
          })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getBill,
    createBill,
    deleteBill,
    updateBill,
    getStatus,
    createStatus,
    deleteStatus,
    updateStatus,
    updateStatusBill,
    getDetailBill,
    createBillSale,
    getProductComment,
    getBillDashboard,
    getSearch
}
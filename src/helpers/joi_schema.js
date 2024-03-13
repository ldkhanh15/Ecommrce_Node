import joi from 'joi'


//USER
export const email = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required()
export const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
export const role = joi.string().required();
export const id = joi.string().required();
export const name = joi.string();
export const username = joi.string().required();
export const birthday = joi.string();
export const gender = joi.string();
export const phone = joi.string();
export const bank = joi.string();
export const introduce = joi.string();
export const address = joi.string().required();
export const idUser = joi.string().required();
export const image = joi.string().required();
export const fileName = joi.string().required();
//BANNER
export const start = joi.string().required();
export const end = joi.string().required();
export const description = joi.string().required();
export const title = joi.string().required();
export const subTitle = joi.string();
export const main = joi.string().required();
//PAYMENT
export const payment = joi.string().required();
//CART
export const quantity = joi.number().required();

//CATEGORY
export const featured = joi.string().required();
//BILL
export const idProduct = joi.string().required();
export const idAddress = joi.string().required();
export const idPayment = joi.string().required();
export const idDeliver = joi.string().required();
export const idBuyer = joi.string().required();
export const idStatus = joi.string().required();
export const idShop = joi.string().required();
export const totalPrice = joi.number().required();
export const products = joi.array().required();
export const status = joi.string().required();

//VOUCHER
export const voucherCode = joi.string().required();
export const remain = joi.number();
export const salePT = joi.number();
export const salePrice = joi.number();
export const minBill = joi.number().required();
export const type = joi.string().required();
export const limit = joi.string().required();

//BLOG
export const field = joi.string().required();
export const idAuthor = joi.string().required();
export const comment = joi.string().required();
export const content = joi.string().required();
export const idBlog = joi.string().required();
//SIZE
export const nameSize = joi.string().required();

//PRODUCT
export const nameProduct = joi.string().required();
export const price = joi.number().required();
export const sale = joi.number().required();
export const idCate = joi.string().required();
export const additional = joi.string();
export const brand = joi.string();
export const size = joi.array();
export const color = joi.array();
export const combo = joi.array();

//COMMENT
export const star = joi.string().required();
export const idBill = joi.string().required();
export const idParent = joi.string();
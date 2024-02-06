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
export const address = joi.string();

export const image = joi.string().required();
export const fileName = joi.string().required();
//BANNER
export const start = joi.string().required();
export const end = joi.string().required();
export const description = joi.string().required();
//PAYMENT
export const payment = joi.string().required();
//CART
export const quantity = joi.number().required();

//PRODUCT
export const idProduct = joi.string().required();
export const idAddress = joi.string().required();
export const idPayment = joi.string().required();
export const idDeliver = joi.string().required();
export const idBuyer = joi.string().required();
export const idStatus = joi.string().required();
export const idShop = joi.string().required();
export const totalPrice = joi.number().required();
export const products = joi.array().required();

//VOUCHER
export  const voucherCode = joi.string().required();
export const remain=joi.number();
export const salePT=joi.number();
export const salePrice = joi.number();
export const minBill = joi.number().required();
export const type = joi.string().required();
export const limit = joi.string().required();
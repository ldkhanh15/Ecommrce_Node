import joi from 'joi'


//USER
export const email = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required()
export const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
export const role= joi.string().required();
export const id = joi.string().required();
export const name = joi.string();
export const username = joi.string().required();
export const birthday= joi.string();
export const gender= joi.string();
export const phone= joi.string();

export const image = joi.string().required();
export const fileName = joi.string().required();
//BANNER
export const start = joi.string().required();
export const end = joi.string().required();
export const description = joi.string();
//PAYMENT
export const payment = joi.string().required();
//CART
export const quantity = joi.number().required();

//PRODUCT
export const idProduct = joi.string().required();
import db from '../models'
import joi from 'joi'
import { id, payment } from '../helpers/joi_schema'
import { Op } from 'sequelize'
const getPayment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Payment.findAll({
                
            })
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

const createPayment = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ payment }).validate({ payment: data.name });
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let payment = await db.Payment.findOne({
                    name: data.name
                })
                if (!payment) {
                    let payment = await db.Payment.create({
                        name: data.name
                    })
                    await payment.save();
                    resolve({
                        code: 1,
                        message: 'Add new payment successfully'
                    })
                } else {
                    resolve({
                        message: 'Payment already existed',
                        code: 0
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deletePayment = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(data);
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let { id } = data;
                let payment = await db.Payment.findOne({ where: { id } })
                if (!payment) {
                    resolve({
                        message: 'Payment not found',
                        code: 0
                    })
                } else {
                    await db.Payment.destroy({ where: { id } })
                    resolve({
                        message: `Payment with id ${payment.id} has been deleted`,
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updatePayment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, payment }).validate({ id: data.id, payment: data.name });
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let { id } = data
                let payment = await db.Payment.findOne({ where: { id } });
                if (!payment) {
                    resolve({
                        message: 'Payment not found',
                        code: 0
                    })
                } else {
                    await db.Payment.update(data, {
                        where: { id }
                    })
                    resolve({
                        message: `Payment with id ${data.id} has been updated`,
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
           let data = await db.Payment.findAll({
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
    getPayment,
    deletePayment,
    updatePayment,
    createPayment,
    getSearch
}
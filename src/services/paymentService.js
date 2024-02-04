import db from '../models'
import joi from 'joi'
import { id, payment } from '../helpers/joi_schema'

const getPayment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = data?.id
            let data = await db.Payment.findAll({
                where: id ? { id } : {}
            })
            resolve({
                data,
                message: 'Successfully'
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
                let payment = await db.Payment.create({
                    name: data.name
                })
                await payment.save();
                resolve({
                    code: 1,
                    message: 'Create payment successfully'
                })
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
                        message: 'ID Payment not found',
                        code: 0
                    })
                } else {
                    await db.Payment.destroy({ where: { id } })
                    resolve({
                        message: 'Delete Payment successfully',
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
                        message: 'ID Payment not found',
                        code: 0
                    })
                } else {
                    await db.Payment.update(data, {
                        where: { id }
                    })
                    resolve({
                        message:'Update payment successfully',
                        code:1
                    })
                }
            }

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
}
import db from '../models'
import joi from 'joi'
import { id,nameDeliver, price } from '../helpers/joi_schema'
const getDeliver = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Deliver.findAll();
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
const createDeliver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ nameDeliver, price }).validate({ price: data.price, nameDeliver: data.name })
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                const exist = await db.Deliver.findOne({
                    where: {
                        name: data.name
                    }
                })
                if (exist) {
                    resolve({
                        message: 'Deliver existed',
                        code: 0
                    })
                }
                const deliver = await db.Deliver.create(data)
                await deliver.save();
                resolve({
                    message: 'Successfully',
                    code: 1,
                })

            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteDeliver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const error = joi.object({ id }).validate(data)
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                let deliver = await db.Deliver.findOne({
                    where: { id: data.id }
                })
                if (!deliver) {
                    resolve({
                        code: 0,
                        message: 'Deliver not found',
                    })
                } else {
                    await db.Deliver.destroy({
                        where: { id: data.id }
                    })
                    resolve({
                        message: 'Deliver deleted',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateDeliver = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ nameDeliver, price, id }).validate({ price: data.price, nameDeliver: data.name, id: data.id })
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                const exist = await db.Deliver.findOne({
                    where: {
                        id: data.id,
                    }
                })
                if (!exist) {
                    resolve({
                        message: 'Deliver not found',
                        code: 0
                    })
                } else {
                    await db.Deliver.update({
                        where: { id: data.id }
                    }, {
                        ...data
                    })
                    resolve({
                        message: 'Deliver updated',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createDeliver,
    getDeliver,
    deleteDeliver,
    updateDeliver
}
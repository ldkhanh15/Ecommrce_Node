import db from '../models'
import joi from 'joi'
import { id, nameSize } from '../helpers/joi_schema'
import { Op } from 'sequelize'
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
const createSize = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ nameSize }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                let size = await db.Size.create({
                    name: req.body.nameSize
                })
                await size.save();
                resolve({
                    message: 'Add new size successfully',
                    code: 1,
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
const deleteSize = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.query)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                await db.Size.destroy({
                    where: { id: req.query.id }
                })
                resolve({
                    message: `Size with id ${req.query.id} has been deleted`,
                    code: 1,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateSize = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, nameSize }).validate(req.body)
            if (error.error) {
                resolve({
                    code: 0,
                    message: error.error?.details[0].message
                })
            } else {
                await db.Size.update({ name: req.body.nameSize }, {
                    where: { id: req.body.id }
                })
                resolve({
                    message: `Size with ${req.body.id} has been updated`,
                    code: 1,
                })
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
           let data = await db.Size.findAll({
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
    getSize,
    createSize,
    deleteSize,
    updateSize,
    getSearch
}
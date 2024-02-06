import db from '../models/index'
import bcrypt from 'bcryptjs'
import { email, password, name, username, birthday, gender, id, phone, role } from '../helpers/joi_schema'
import joi from 'joi'


const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const getUser = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = req.body
            if (req.user.role !== 'R1') {
                if (id !== String(req.user.id)) {
                    resolve({
                        message: 'You are not allowed to get information another user',
                        code:0
                    })
                }
            }
            let data = await db.User.findAll({
                where: id ? {
                    id: id,
                } : {},
                attributes: {
                    exclude: ['password']
                }
            });
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
const createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ email, password, role, birthday, gender, name, username, phone }).validate(data)

            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let user = await db.User.findOne({
                    where: { email: data?.email }
                })
                if (!user) {
                    let createUser = await db.User.create({
                        email: data?.email,
                        password: hashPassword(data?.password),
                        role: data?.role,
                        birthday: data.birthday,
                        gender: data.gender,
                        name: data.name,
                        username: data.username,
                        phone: data.phone,
                    })
                    await createUser.save()
                    resolve({
                        message: 'Successfully created',
                        code: 1
                    })
                } else {
                    resolve({
                        message: 'Email already exists',
                        code: 0
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const updateUser = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ birthday, gender, id, name, username, phone }).validate(req.body)

            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let { id, birthday, gender, name, username, phone } = req.body
                if (req.user.role !== 'R1') {
                    if (id !== String(req.user.id)) {
                        resolve({
                            message: 'You are not allowed to update information another user',
                            code:0
                        })
                    }
                }
                let user = await db.User.findOne({
                    where: { id }
                })
                if (!user) {
                    resolve({
                        message: 'User not found!',
                        code: 0
                    })
                } else {
                    await db.User.update({
                        birthday,
                        gender,
                        name,
                        username,
                        phone,
                    }, {
                        where: { id }
                    })
                    resolve({
                        message: 'User updated successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(data);
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                await db.User.destroy({
                    where: { id: data.id },
                })
                resolve({
                    message: 'User deleted successfully',
                    code: 1
                })
            } else {
                resolve({
                    message: 'User not found',
                    code: 0
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
}
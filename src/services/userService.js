import db from '../models/index'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { email, password } from '../helpers/joi_schema'
import joi from 'joi'


const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const getUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll();
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
            const error = joi.object({ email, password }).validate(data)

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
                        password: hashPassword(data?.password)
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
module.exports = {
    getUser,
    createUser
}
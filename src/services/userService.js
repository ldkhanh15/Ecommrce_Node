import db from '../models/index'
import bcrypt from 'bcryptjs'
import { email, password, name, username, birthday, gender, id, phone, role, idUser, address } from '../helpers/joi_schema'
import joi from 'joi'


const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const getUser = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (req.user.role !== 'R1') {
                if (req.query.id) {
                    if (req.query.id !== String(req.user.id)) {
                        resolve({
                            message: 'You are not allowed to get information another user',
                            code: 0
                        })
                    }
                    let data = await db.User.findOne({
                        where: { id: req.query.id },
                        attributes: {
                            exclude: ['password']
                        }
                    });
                    resolve({
                        data,
                        code: 1,
                        message: 'Successfully'
                    })
                } else {
                    let data = await db.User.findOne({
                        where: { id: req.user.id },
                        attributes: {
                            exclude: ['password']
                        }
                    });
                    resolve({
                        data,
                        code: 1,
                        message: 'Successfully'
                    })
                }
            }
            let data;
            if (req.query.id) {
                data = await db.User.findOne({
                    where: { id: req.query.id },
                    attributes: {
                        exclude: ['password']
                    }
                });
            } else {
                data = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            }

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
const getCustomer = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = req.query
            if (req.user.role !== 'R1') {
                if (id !== String(req.user.id)) {
                    resolve({
                        message: 'You are not allowed to get information another user',
                        code: 0
                    })
                }
            }
            let data = await db.User.findAll({
                where: id ? {
                    id: id,
                } : {},
                attributes: {
                    exclude: ['password', 'avatar', 'gender', 'fileName', 'birthday']
                },
                include: [
                    {
                        model: db.Bill, as: 'bill', attributes: [
                            [db.sequelize.fn('COUNT', db.sequelize.col('*')), 'totalOrders'],
                            [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN idStatus = 1 THEN 1 ELSE 0 END')), 'successfulOrders'],
                            [db.sequelize.fn('SUM', db.sequelize.literal('CASE WHEN idStatus = 1 THEN totalPrice ELSE 0 END')), 'totalPrice'],
                        ]
                    }
                ],
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
const createUser = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ email, password, role, birthday, gender, name, username, phone }).validate(req.body)

            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            } else {
                let user = await db.User.findOne({
                    where: { email: req.body.email }
                })
                if (!user) {
                    let createUser = await db.User.create({
                        ...req.body,
                        password: hashPassword(req.body.password),
                    })
                    await createUser.save()
                    if (req.body.role === 'R2') {
                        let vendor = await db.Shop.create({
                            idUser: createUser.id,
                            ...req.body,
                            avgStar: 0,
                            comment: 0
                        })
                        await vendor.save()
                    }
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
                            code: 0
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
const deleteUser = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id }).validate(req.body);
            if (error.error) {
                resolve({
                    message: error.error?.details[0]?.message,
                    code: 0
                })
            }
            let user = await db.User.findOne({
                where: { id: req.body.id }
            })
            if (user) {
                await db.User.destroy({
                    where: { id: req.body.id },
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


//ADDRESS
const getAddress = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (req.user.role !== 'R1') {
                let id = req.user.id
                let data = await db.AddressUser.findAll({
                    where: { idUser: id },
                })
                resolve({
                    message: 'Successfully',
                    data
                })
            } else {
                let data = await db.AddressUser.findAll();

                resolve({
                    message: 'Successfully',
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const createAddress = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ idUser, address }).validate(req.body);
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {

                if (req.user.role !== 'R1') {
                    let id = req.user.id
                    if (req.body.idUser !== String(id)) {
                        resolve({
                            message: 'You cannot create address for another user',
                            code: 0
                        })
                    } else {
                        let address = await db.AddressUser.create({
                            address: req.body.address,
                            idUser: req.user.id
                        })
                        await address.save();
                        resolve({
                            message: 'Address created successfully',
                            code:1,

                        })
                    }
                } else {

                    let user = await db.User.findOne({
                        where: {
                            id: req.body.idUser
                        }
                    })
                    if (!user) {
                        resolve({
                            message: 'Id user not found',
                            code: 0
                        })
                    } else {
                        let address = await db.AddressUser.create({
                            ...req.body
                        })
                        await address.save();
                        resolve({
                            message: 'Address created successfully',
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
const updateAddress = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idUser, address }).validate(req.body);
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {

                if (req.user.role !== 'R1') {
                    let id = req.user.id
                    if (req.body.idUser !== String(id)) {
                        resolve({
                            message: 'You cannot update address for another user',
                            code: 0
                        })
                    }
                }
                let address = await db.AddressUser.findOne({
                    where: {
                        id: req.body.idUser,
                        idUser: req.body.idUser
                    }
                })
                if (!address) {
                    resolve({
                        message: 'Id address not found',
                        code: 0
                    })
                } else {
                    await db.AddressUser.update(req.body, {
                        where: {
                            id: req.body.idUser,
                            idUser: req.body.idUser
                        }
                    })

                    resolve({
                        message: 'Address updated successfully',
                        code: 1
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
const deleteAddress = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = joi.object({ id, idUser }).validate(req.query);
            if (error.error) {
                resolve({
                    message: error.error?.details[0].message,
                    code: 0
                })
            } else {
                if (req.user.role !== 'R1') {
                    let id = req.user.id
                    if (req.query.idUser !== String(id)) {
                        resolve({
                            message: 'You cannot delete address for another user',
                            code: 0
                        })
                    }
                }
                let address = await db.AddressUser.findOne({
                    where: {
                        id: req.query.id,
                        idUser: req.query.idUser
                    }
                })
                if (!address) {
                    resolve({
                        message: 'Id address not found',
                        code: 0
                    })
                } else {
                    await db.AddressUser.destroy({
                        where: {
                            id: req.query.id,
                            idUser: req.query.idUser
                        }
                    })

                    resolve({
                        message: 'Address deleted successfully',
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
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getCustomer,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
}
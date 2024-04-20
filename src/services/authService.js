import db from '../models'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const login = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = req.body;
            let existingUser = await db.User.findOne({
                where: {
                    email
                }
            })
            if (!existingUser) {
                resolve({
                    message: "User not found",
                    code: 0
                })
            }
            let isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
            if (!isPasswordCorrect) {
                resolve({
                    message: "Password is incorrect",
                    code: 0
                })
            }
            const token = jwt.sign({ id: existingUser.id, role: existingUser.role }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })

            if (req.cookies[`${existingUser.id}`]) {
                req.cookies[`${existingUser.id}`] = ""
            }

            res.cookie("token", token, {
                path: '/',
                expires: new Date(Date.now() + 60 * 60 * 24),
                httpOnly: true,
                sameSite: "lax"
            })
            resolve({
                message: "Login successfully",
                user: {
                    id: existingUser.id,
                    name: existingUser.name,
                    username: existingUser.username,
                    email: existingUser.email,
                    role: existingUser.role,
                    phone: existingUser.phone,
                    avatar: existingUser.avatar,
                },
                token,
                code: 1
            })
        } catch (error) {
            reject(error)
        }
    })
}

const logout = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cookie = req.headers?.authorization;
            const prevToken = cookie?.split(' ')[1];

            if (!prevToken) {
                resolve({
                    message: 'Could not find token',
                    code: 0
                })
            }
            jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    console.log(err);
                    resolve({
                        message: 'Invalid token refresh',
                        code: 0
                    })
                }

                req.cookies[`${user.id}`] = "";
                res.clearCookie(`${user.id}`)

                resolve({
                    message: 'Logout successfully',
                    code: 1
                })
            })

        } catch (error) {
            reject(error)
        }
    })
}
const register = (req) => {
    return new Promise(async (resolve, reject) => {
        try {

            resolve({
                message: 'Register Successfully'
            })
        } catch (error) {
            reject(error)
        }
    })
}
const check = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cookie = req.headers?.authorization;
            const token = cookie?.split(' ')[1];
            if (!token) {
                resolve({
                    message: 'Please login to continue',
                    code: 0,
                    user:null
                })
            }
            jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    resolve({
                        message:'Token is invalid or expired',
                        code:0,
                        user:null
                    })
                }
                resolve({
                    message:'Check login successfully',
                    code:1,
                    user:req.user
                })

            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    login,
    logout,
    register,
    check
}
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
                    message: "User not found"
                })
            }
            let isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
            if (!isPasswordCorrect) {
                resolve({
                    message: "Password is incorrect"
                })
            }
            const token = jwt.sign({ id: existingUser.id, role: existingUser.role }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })

            if (req.cookies[`${existingUser.id}`]) {
                req.cookies[`${existingUser.id}`] = ""
            }

            res.cookie(String(existingUser.id, existingUser.role), token, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 30 * 60 * 24),
                httpOnly: true,
                sameSite: "lax"
            })
            resolve({
                message: "Login successfully",
                user: existingUser,
                token
            })
        } catch (error) {
            reject(error)
        }
    })
}

const logout = (req,res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cookie = req.headers.cookie;
            const prevToken = cookie.split('=')[1];

            if (!prevToken) {
                resolve({
                    message: 'Could not find token'
                })
            }
            jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    console.log(err);
                    resolve({ message: 'Invalid token refresh' })
                }

                req.cookies[`${user.id}`] = "";
                res.clearCookie(`${user.id}`)

                resolve({ message: 'Logout successfully' })
            })
            resolve({
                message: 'Successfully'
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
                message: 'Successfully'
            })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    login,
    logout,
    register
}
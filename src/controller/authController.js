import authService from '../services/authService'
import jwt from 'jsonwebtoken'
import { notAuth } from '../middleware/handle_error';
const register = async (req, res) => {
    try {
        let data = await authService.register(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const login = async (req, res) => {
    try {
        let data = await authService.login(req, res);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const logout = async (req, res) => {
    try {
        let data = await authService.logout(req, res);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
const verifyToken = (req, res, next) => {
    const cookie = req.headers?.authorization;
    const token = cookie?.split(' ')[1];
    if (!token) {
        return notAuth('Token not found', res)
    }
    jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return notAuth('Token not valid or expired', res)
        }
        req.user = user;
        console.log('user', req.user);
        next();
    })
}
const refreshToken = (req, res, next) => {
    const cookie = req.headers?.authorization;
    const prevToken = cookie?.split(' ')[1];
    if (!prevToken) {
        return notAuth('Token not found', res)
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return notAuth('Token not valid or expired', res)
        }

        req.cookies[`${user.id}`] = "";
        res.clearCookie(`${user.id}`)

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })

        res.cookie(String(user.id, user.role), token, {
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 24),
            httpOnly: true,
            sameSite: "lax"
        })

        req.user = user
        next();

    })
}
const isAdmin = (req, res, next) => {
    if (req.user) {
        if (req.user.role === 'R1') {
            next();
        } else {
            return notAuth('Required role Administrator', res)
        }
    }
}
const isSeller = (req, res, next) => {
    if (req.user) {
        if (req.user.role === 'R1' || req.user.role === 'R2') {
            next();
        } else {
            return notAuth('Required role Administrator or Seller', res)
        }
    }

}
const isBuyer = (req, res, next) => {
    if (req.user) {
        if (req.user.role === 'R1' || req.user.role === 'R2' || req.user.role === 'R3') {
            next();
        } else {
            return notAuth('Require role admin, seller or buyer', res)
        }
    }
}
const check = async (req, res) => {
    try {
        let data=await authService.check(req)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    register,
    login,
    logout,
    verifyToken,
    refreshToken,
    isAdmin,
    isSeller,
    isBuyer,
    check
}
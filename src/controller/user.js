import userService from '../services/user'

const getUserPayment = async (req, res) => {
    try {
        const data = await userService.getUserPayment();
        return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getUserPayment
}
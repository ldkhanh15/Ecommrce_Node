import voucherService from '../services/voucherService'

const getVoucher = async (req, res) => {
    try {
        const data = await voucherService.getVoucher(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const createVoucher = async (req, res) => {
    try {
        const data = await voucherService.createVoucher(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const deleteVoucher = async (req, res) => {
    try {
        const data = await voucherService.deleteVoucher(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

const updateVoucher = async (req, res) => {
    try {
        const data = await voucherService.updateVoucher(req);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getVoucher,
    createVoucher,
    deleteVoucher,
    updateVoucher,
}
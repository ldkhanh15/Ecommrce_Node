import voucherService from '../services/voucherService'

const getVoucherProduct = async (req, res) => {
    try {
        const data = await voucherService.getVoucherProduct();
        return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
    }
}
const useVoucher = async (req, res) => {
    try {
        const data = await voucherService.useVoucher(req.body);
        return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
    }
}
module.exports={
    getVoucherProduct,
    useVoucher
}
import db from '../models/index'

const getVoucherProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.Voucher.findAll({
                include: [
                    {
                        model: db.Shop, as: 'shop', attributes: ['name'],
                        include: [
                            {
                                model: db.Product, as: 'product'
                            }
                        ]
                    }
                ]
            })
            resolve({ data })
        } catch (error) {
            reject(error)
        }
    })
}
const useVoucher = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let voucher = await db.Voucher.findOne({
                where: {
                    maVoucher: 'mungxuan2024'
                }
            })
            if (voucher.quantity === 0) {
                resolve('Đã hết mã')
            } else {
                voucher.quantity = voucher.quantity - 1;
                await voucher.save();
                resolve('success')
            }

        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getVoucherProduct,
    useVoucher
}
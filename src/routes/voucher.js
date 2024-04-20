const router = require('express').Router()
import voucherController from '../controller/voucherController'
import authController from '../controller/authController'

router.get('/', voucherController.getVoucher)
router.get('/all', voucherController.getVoucherOfAll)

router.use(authController.verifyToken)
router.use(authController.isBuyer)
router.get('/get-voucher-shop', voucherController.getVoucherOfShop)
router.use(authController.isSeller)
router.get('/search', voucherController.getSearch)
router.put('/update', voucherController.updateVoucher)
router.delete('/delete', voucherController.deleteVoucher)
router.post('/create', voucherController.createVoucher)


module.exports = router
const router = require('express').Router()
import voucherController from '../controller/voucherController'
import authController from '../controller/authController'

router.get('/', voucherController.getVoucher)

router.use(authController.verifyToken)
router.use(authController.isSeller)
router.put('/update', voucherController.updateVoucher)
router.delete('/delete', voucherController.deleteVoucher)
router.post('/create', voucherController.createVoucher)


module.exports = router
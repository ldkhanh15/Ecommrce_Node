const router = require('express').Router()
import voucherController from '../controller/voucherController'

router.get('/', voucherController.getVoucherProduct)
router.post('/use', voucherController.useVoucher)



module.exports = router
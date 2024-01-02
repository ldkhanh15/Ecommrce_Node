const router = require('express').Router()
import voucherController from '../controller/voucher'

router.get('/', voucherController.getVoucherProduct)
router.post('/use', voucherController.useVoucher)



module.exports = router
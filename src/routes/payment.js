const router = require('express').Router();
import paymentController from '../controller/paymentController'
import authController from '../controller/authController'

router.get('/',paymentController.getPayment)
router.use(authController.verifyToken)

router.use(authController.isAdmin)
router.post('/create',paymentController.createPayment)
router.delete('/delete',paymentController.deletePayment)
router.put('/update',paymentController.updatePayment)

module.exports = router
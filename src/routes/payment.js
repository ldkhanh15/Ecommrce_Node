const router = require('express').Router();
import paymentController from '../controller/paymentController'
import authController from '../controller/authController'

router.use(authController.verifyToken)
router.use(authController.isBuyer)
router.get('/',paymentController.getPayment)

router.use(authController.isAdmin)
router.get('/search', paymentController.getSearch)
router.post('/create',paymentController.createPayment)
router.delete('/delete',paymentController.deletePayment)
router.put('/update',paymentController.updatePayment)

module.exports = router
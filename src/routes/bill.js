const router = require('express').Router();
import billController from '../controller/billController'
import authController from '../controller/authController'

router.use(authController.verifyToken)
router.use(authController.isBuyer)

router.get('/', billController.getBill)
router.post('/create', billController.createBill)
router.delete('/delete', billController.deleteBill)
router.use(authController.isSeller)
router.put('/update', billController.updateBill)
module.exports = router
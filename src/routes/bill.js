const router = require('express').Router();
import billController from '../controller/billController'
import authController from '../controller/authController'

router.use(authController.verifyToken)
router.use(authController.isBuyer)

router.get('/', billController.getBill)
router.post('/create', billController.createBill)
router.post('/buy-sale', billController.createBillSale)
router.put('/update-status', billController.updateStatusBill)
router.get('/detail',billController.getDetailBill)
router.use(authController.isSeller)
router.put('/update', billController.updateBill)
router.get('/status', billController.getStatus)

router.use(authController.isAdmin)
router.delete('/delete', billController.deleteBill)
router.post('/status/create', billController.createStatus)
router.delete('/status/delete', billController.deleteStatus)
router.put('/status/update', billController.updateStatus)

module.exports = router
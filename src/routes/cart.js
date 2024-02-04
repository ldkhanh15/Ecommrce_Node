const router = require('express').Router();
import cartController from '../controller/cartController'
import authController from '../controller/authController'

router.use(authController.verifyToken)
router.get('/', cartController.getCart)
router.delete('/delete', cartController.deleteCart)
router.post('/add', cartController.addCart)
router.put('/update', cartController.updateCart)
module.exports = router
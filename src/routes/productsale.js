const router = require('express').Router()
import productSaleController from '../controller/productSaleController'
import authController from '../controller/authController'

router.get('/', productSaleController.getAllProduct)
router.use(authController.verifyToken)
router.use(authController.isSeller)

router.post('/add-product', productSaleController.addProduct)
router.post('/buy', productSaleController.buyProduct)
router.delete('/delete-product', productSaleController.deleteProduct)
router.put('/update-product', productSaleController.updateProduct)

module.exports = router
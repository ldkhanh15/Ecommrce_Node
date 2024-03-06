const router = require('express').Router()
import productController from '../controller/productController'
import authController from '../controller/authController'
import cloudinary from '../config/cloudinary/cloudinary'

router.get('/', productController.getProduct)
router.get('/product-comment', productController.getProductComment)
router.get('/product-shop', productController.getProductShop)
router.use(authController.verifyToken)
router.use(authController.isSeller);
router.post('/create', cloudinary.uploadImage.array('image'), productController.createProduct)
router.delete('/delete', productController.deleteProduct)
router.put('/update', cloudinary.uploadImage.array('image'), productController.updateProduct)

module.exports = router
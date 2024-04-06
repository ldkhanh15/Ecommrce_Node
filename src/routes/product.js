const router = require('express').Router()
import productController from '../controller/productController'
import authController from '../controller/authController'
import cloudinary from '../config/cloudinary/cloudinary'

router.get('/', productController.getProduct)
router.get('/comment', productController.getProductComment)
router.get('/shop', productController.getProductShop)
router.use(authController.verifyToken)
router.use(authController.isBuyer)
router.post('/like-product',productController.likeProduct)
router.delete('/unlike-product',productController.unlikeProduct)
router.post('/create-comment', productController.createProductComment)
router.delete('/delete-comment', productController.deleteProductComment)
router.put('/update-comment', productController.updateProductComment)
router.use(authController.isSeller);
router.get('/get-product-shop', productController.getProductOfShop)
router.post('/create', cloudinary.uploadImage.array('images'), productController.createProduct)
router.delete('/delete', productController.deleteProduct)
router.put('/update', cloudinary.uploadImage.array('images'), productController.updateProduct)

module.exports = router
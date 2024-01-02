const router = require('express').Router()
import productController from '../controller/product'

router.get('/', productController.getProduct)
router.post('/', productController.createProduct)


module.exports = router
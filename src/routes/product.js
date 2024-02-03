const router = require('express').Router()
import productController from '../controller/productController'

router.get('/', productController.getProduct)
router.post('/', productController.createProduct)


router.get('/size',productController.getSize)
router.post('/size',productController.createSize)
router.put('/size',productController.updateSize)
router.delete('/size',productController.deleteSize)

module.exports = router
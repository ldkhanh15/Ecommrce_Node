const router = require('express').Router()
import sizeController from '../controller/sizeController'
import authController from '../controller/authController'

//PUBLIC ROUTES


//PRIVATE ROUTES
router.use(authController.verifyToken)

router.use(authController.isSeller)
router.get('/', sizeController.getSize)

router.use(authController.isAdmin)
router.put('/update', sizeController.updateSize)
router.post('/create', sizeController.createSize)
router.delete('/delete', sizeController.deleteSize)

module.exports = router
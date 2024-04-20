const router = require('express').Router();
import deliverController from '../controller/deliverController'
import authController from '../controller/authController'

router.use(authController.verifyToken)
router.use(authController.isBuyer)
router.get('/',deliverController.getDeliver)
router.use(authController.isAdmin)
router.get('/search', deliverController.getSearch)
router.post('/create',deliverController.createDeliver)
router.put('/update',deliverController.updateDeliver)
router.delete('/delete',deliverController.deleteDeliver)
module.exports = router
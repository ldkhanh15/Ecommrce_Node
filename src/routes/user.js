const router = require('express').Router()
import userController from '../controller/userController'
import authController from '../controller/authController'

//PUBLIC ROUTES


//PRIVATE ROUTES
router.use(authController.verifyToken)
router.get('/', userController.getUser)

router.use(authController.isBuyer)
router.post('/update', userController.updateUser)

router.use(authController.isAdmin)
router.post('/create', userController.createUser)
router.post('/delete', userController.deleteUser)

module.exports = router
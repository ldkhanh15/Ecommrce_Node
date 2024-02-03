const router = require('express').Router()
import userController from '../controller/userController'
import authController from '../controller/authController'

router.get('/', authController.refreshToken, authController.verifyToken, authController.isBuyer, userController.getUser)
router.post('/create', userController.createUser)


module.exports = router
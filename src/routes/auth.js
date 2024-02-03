const router = require('express').Router();
import authController from '../controller/authController'

router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/logout',authController.logout)

module.exports = router
const router = require('express').Router()
import userController from '../controller/user'

router.get('/', userController.getUserPayment)



module.exports = router
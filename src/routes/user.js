const router = require('express').Router()
import userController from '../controller/userController'

router.get('/', userController.getUser)
router.post('/create', userController.createUser)


module.exports = router
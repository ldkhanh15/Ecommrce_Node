const router = require('express').Router()
import userController from '../controller/userController'
import authController from '../controller/authController'

//PUBLIC ROUTES


//PRIVATE ROUTES
router.use(authController.verifyToken)
router.use(authController.isBuyer)
router.get('/', userController.getUser)

router.put('/update', userController.updateUser)

router.get('/address', userController.getAddress)
router.post('/address/create', userController.createAddress)
router.put('/address/update', userController.updateAddress)
router.delete('/address/delete', userController.deleteAddress)

router.use(authController.isSeller)
router.get('/search', userController.getSearch)
router.get('/customer', userController.getCustomer)
router.use(authController.isAdmin)
router.post('/create', userController.createUser)
router.delete('/delete', userController.deleteUser)


module.exports = router
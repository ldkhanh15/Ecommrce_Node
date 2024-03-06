const router = require('express').Router();
import vendorController from '../controller/vendorController'
import authController from '../controller/authController'
import cloudinary from '../config/cloudinary/cloudinary'

router.get('/', vendorController.getVendor)
router.post('/create',cloudinary.uploadImage.single('image'), vendorController.createVendor)

router.use(authController.verifyToken)
router.use(authController.isSeller)
router.put('/update', cloudinary.uploadImage.single('image'), vendorController.updateVendor)
router.delete('/delete', vendorController.deleteVendor)
module.exports = router
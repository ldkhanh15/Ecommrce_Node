const router = require('express').Router();
import vendorController from '../controller/vendorController'
import authController from '../controller/authController'
import cloudinary from '../config/cloudinary/cloudinary'

router.get('/', vendorController.getVendor)
router.get('/all', vendorController.getVendorAll)
router.post('/create', cloudinary.uploadImage.single('image'), vendorController.createVendor)
router.use(authController.verifyToken)
router.use(authController.isSeller)
router.post('/add-deliver', vendorController.addDeliver)
router.get('/deliver', vendorController.getDeliver)
router.delete('/delete-deliver', vendorController.delDeliver)
router.put('/update', vendorController.updateVendor)
router.put('/update-avatar', cloudinary.uploadImage.single('image'), vendorController.updateAvatarVendor)
router.delete('/delete', vendorController.deleteVendor)
module.exports = router
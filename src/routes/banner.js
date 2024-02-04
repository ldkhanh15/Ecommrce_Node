const router = require('express').Router();
import bannerController from '../controller/bannerController'
import cloudinary from '../config/cloudinary/cloudinary'
import authController from '../controller/authController'

//PUBLIC ROUTES
router.get('/', bannerController.getBanner)

//PRIVATE ROUTES
router.use(authController.verifyToken)
router.use(authController.isAdmin)
router.post('/create', cloudinary.uploadImage.single('image'), bannerController.createBanner);
router.delete('/delete', bannerController.deleteBanner);
router.put('/update', cloudinary.uploadImage.single('image'), bannerController.updateBanner);

module.exports = router
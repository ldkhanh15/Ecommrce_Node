const router = require('express').Router();
import bannerController from '../controller/bannerController'
import cloudinary from '../config/cloudinary/cloudinary'
import authController from '../controller/authController'

//PUBLIC ROUTES
router.get('/', bannerController.getBanner)

//PRIVATE ROUTES
router.use(authController.verifyToken)
router.use(authController.isAdmin)
router.get('/search', bannerController.getSearch)
router.get('/all', bannerController.getAllBanner)
router.post('/create', cloudinary.uploadImage.single('image'), bannerController.createBanner);
router.post('/upload', cloudinary.uploadImage.single('image'), bannerController.uploadImage);
router.delete('/delete', bannerController.deleteBanner);
router.put('/update', bannerController.updateBanner);

module.exports = router
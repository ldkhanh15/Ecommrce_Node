const router = require('express').Router();
import bannerController from '../controller/bannerController'
import cloudinary from '../config/cloudinary/cloudinary'

router.get('/', bannerController.getBanner)
router.post('/create', cloudinary.uploadImage.single('image'), bannerController.createBanner);
router.delete('/delete', bannerController.deleteBanner);
router.put('/update', cloudinary.uploadImage.single('image'), bannerController.updateBanner);
module.exports = router
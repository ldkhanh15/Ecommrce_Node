const router = require('express').Router()
import blogController from '../controller/blogController'
import authController from '../controller/authController'
import cloudinary from '../config/cloudinary/cloudinary'

router.use(authController.verifyToken)
router.use(authController.isBuyer)
router.get('/', blogController.getBlog)
router.post('/create', cloudinary.uploadImage.single('image'), blogController.createBlog)
router.put('/update', cloudinary.uploadImage.single('image'), blogController.updateBlog)
router.delete('delete', blogController.deleteBlog)


module.exports = router
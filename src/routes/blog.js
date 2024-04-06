const router = require('express').Router()
import blogController from '../controller/blogController'
import authController from '../controller/authController'
import cloudinary from '../config/cloudinary/cloudinary'

router.get('/', blogController.getBlog)
router.get('/detail', blogController.getBlogDetail)
router.get('/comment', blogController.getComment)
router.use(authController.verifyToken)
router.use(authController.isSeller)
router.post('/comment/create', blogController.createComment)
router.put('/comment/update', blogController.updateComment)
router.delete('/comment/delete', blogController.deleteComment)
router.post('/create', cloudinary.uploadImage.single('image'), blogController.createBlog)
router.post('/upload-image', cloudinary.uploadImage.single('image'), blogController.uploadImage)
router.put('/update', cloudinary.uploadImage.single('image'), blogController.updateBlog)
router.delete('/delete', blogController.deleteBlog)


module.exports = router
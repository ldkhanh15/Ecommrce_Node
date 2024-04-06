const router = require('express').Router();
import categoryController from '../controller/categoryController'
import authController from '../controller/authController'
import cloudinary from '../config/cloudinary/cloudinary'
//PUBLIC ROUTES 
router.get('/', categoryController.getCate);

//PRIVATE ROUTES
router.use(authController.verifyToken);
router.use(authController.isAdmin);
router.get('/all',categoryController.getAllCate)
router.post('/upload',cloudinary.uploadImage.single('image'),categoryController.uploadImage)

router.post('/create', cloudinary.uploadImage.single('image'), categoryController.createCate);
router.delete('/delete', categoryController.deleteCate);
router.put('/update', categoryController.updateCate);

module.exports = router
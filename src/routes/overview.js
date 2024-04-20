const router = require('express').Router();
import overviewController from '../controller/overviewController'
import authController from '../controller/authController'

router.use(authController.verifyToken)
router.use(authController.isSeller)
router.get('/',overviewController.getOverview)


module.exports = router
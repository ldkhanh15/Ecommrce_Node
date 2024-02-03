const router = require('express').Router();
import deliverController from '../controller/deliverController'


router.get('/',deliverController.getDeliver)
router.post('/',deliverController.createDeliver)
router.put('/',deliverController.updateDeliver)
router.delete('/',deliverController.deleteDeliver)
module.exports = router
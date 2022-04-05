const express = require('express');
const router = express.Router();
const suscriberController = require('../controller/Suscriber')
const { validateSuscriber, validateUpdateSuscriber }  = require('../middleware/validation/suscriber')
const isAuth = require('../middleware/isAuth')

router.post('/', isAuth, validateSuscriber,suscriberController.create)
router.get('/', isAuth,suscriberController.getAll)
router.get('/:suscriberId', isAuth, suscriberController.getOne)
router.put('/:suscriberId', isAuth,validateUpdateSuscriber, suscriberController.updateOne)
router.put('/block/:suscriberId',isAuth,suscriberController.blockAndUnblock)

module.exports = router
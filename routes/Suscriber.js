const express = require('express');
const router = express.Router();
const suscriberController = require('../controller/Suscriber')

router.post('/',suscriberController.create)
router.get('/',suscriberController.getAll)
router.get('/:suscriberId',suscriberController.getOne)
router.put('/:suscriberId',suscriberController.updateOne)
router.put('/block/:suscriberId',suscriberController.blockAndUnblock)

module.exports = router
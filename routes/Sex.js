const express = require('express');
const router = express.Router();
const SexController = require('../controller/Sex')

router.post('/',SexController.create)
router.get('/',SexController.getAll)
router.get('/:sexId', SexController.getOne)
router.put('/:sexId', SexController.updateOne)

module.exports = router
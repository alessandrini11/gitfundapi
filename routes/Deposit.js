const express = require('express');
const router = express.Router();
const depositController = require('../controller/Deposit')

router.post('/', depositController.create)
router.get('/', depositController.getAll)
router.get('/:depositId', depositController.getOne)
router.put('/:depositId', depositController.updateOne)
router.delete('/:depositId', depositController.deleteOne)

module.exports = router
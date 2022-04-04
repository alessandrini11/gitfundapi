const express = require('express')
const router = express.Router()
const withdrawalController = require('../controller/Withdrawal')

router.post('/', withdrawalController.create)
router.get('/', withdrawalController.getAll)
router.get('/:withdrawalId', withdrawalController.getOne)
router.put('/:withdrawalId', withdrawalController.updateOne)
router.delete('/:withdrawalId', withdrawalController.deleteOne)

module.exports = router
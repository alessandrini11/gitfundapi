const express = require('express')
const router = express.Router()
const withdrawalController = require('../controller/Withdrawal')

router.post('/')
router.get('/')
router.get('/:withdrawalId')
router.put('/:withdrawalId')
router.delete('/:withdrawalId')

module.exports = router
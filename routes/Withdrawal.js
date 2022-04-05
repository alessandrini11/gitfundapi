const express = require('express')
const router = express.Router()
const withdrawalController = require('../controller/Withdrawal')
const { validateWithdrawal } = require('../middleware/validation/withdrawal')
const isAuth = require('../middleware/isAuth')


router.post('/', isAuth, validateWithdrawal, withdrawalController.create)
router.get('/', isAuth, withdrawalController.getAll)
router.get('/:withdrawalId', isAuth, withdrawalController.getOne)
router.put('/:withdrawalId', isAuth, validateWithdrawal, withdrawalController.updateOne)
router.delete('/:withdrawalId', isAuth, withdrawalController.deleteOne)

module.exports = router
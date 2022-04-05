const express = require('express');
const router = express.Router();
const depositController = require('../controller/Deposit')
const { validateAmount } = require('../middleware/validation/deposit')
const isAuth = require('../middleware/isAuth')

router.post('/', isAuth, validateAmount, depositController.create)
router.get('/', isAuth, depositController.getAll)
router.get('/:depositId', isAuth, depositController.getOne)
router.put('/:depositId', isAuth, validateAmount, depositController.updateOne)
router.delete('/:depositId', isAuth, depositController.deleteOne)

module.exports = router
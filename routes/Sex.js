const express = require('express');
const router = express.Router();
const SexController = require('../controller/Sex')
const isAuth = require('../middleware/isAuth')
const { body } = require('express-validator')

const validateSexName = [
    body('name')
        .trim()
        .isString()
]

router.post('/',isAuth, validateSexName, SexController.create)
router.get('/',isAuth, SexController.getAll)
router.get('/:sexId', isAuth, SexController.getOne)
router.put('/:sexId',isAuth,validateSexName , SexController.updateOne)

module.exports = router
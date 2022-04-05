const express = require('express');
const router = express.Router();
const specialityController = require('../controller/Speciality')
const isAuth = require('../middleware/isAuth')
const { body } = require('express-validator')

const validateSpecialityName = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Please enter a value')
]
router.post('/',isAuth, validateSpecialityName,specialityController.create)
router.get('/',isAuth, specialityController.getAll)
router.get('/:specialityId', isAuth,specialityController.getOne)
router.put('/:specialityId',isAuth, validateSpecialityName,specialityController.updateOne)

module.exports = router
const { body } = require('express-validator')

exports.validateAmount = [
    body('amount')
        .isNumeric()
        .withMessage('Enter a numeric value')
        .trim()
]

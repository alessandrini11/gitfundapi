const { body } = require('express-validator')

exports.validateAmount = [
    body('amount')
        .notEmpty()
        .withMessage('The amout must not be empty')
        .isNumeric()
        .withMessage('Enter a numeric value')
        .trim()
]

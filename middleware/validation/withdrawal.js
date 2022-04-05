const { body } = require('express-validator')

exports.validateWithdrawal = [
    body('amount')
        .notEmpty()
        .withMessage('The first name must not be empty')
        .isNumeric()
        .withMessage('Please enter a numeric value')
        .trim(),
    body('reason')
        .notEmpty()
        .withMessage('The last name must not be empty')
        .trim(),
]
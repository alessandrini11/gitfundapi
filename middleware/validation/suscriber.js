const Suscriber = require('../../model/Suscriber')
const { body } = require('express-validator')

exports.validateSuscriber = [
    body('firstName')
        .notEmpty()
        .withMessage('The first name must not be empty')
        .trim(),
    body('lastName')
        .notEmpty()
        .withMessage('The last name must not be empty')
        .trim(),
    body('registrationNumber')
        .notEmpty()
        .withMessage('The last name must not be empty')
        .trim()
        .custom((value, {req}) => {
            return Suscriber.findOne({ registrationNumber: value })
                .then(suscriber => {
                    if(suscriber){
                        return Promise.reject('Registration number already in use')
                    }
                })
        })
]

exports.validateUpdateSuscriber = [
    body('firstName')
        .notEmpty()
        .withMessage('The first name must not be empty')
        .trim(),
    body('lastName')
        .notEmpty()
        .withMessage('The last name must not be empty')
        .trim(),
]
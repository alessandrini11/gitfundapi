const { body, check } = require('express-validator')
const Admin = require('../../model/Admin')

exports.validateLogin = [
    body('username')
        .trim()
        .isEmpty()
        .withMessage('Enter a username'),
    body('password')
        .trim()
        .isEmpty()
        .withMessage('Enter a password')
]

exports.validateRegister = [
    body('username')
        .trim()
        .custom((value, {req}) => {
            return Admin.findOne({username: value})
                    .then(admin => {
                        if(admin){
                            return Promise.reject('Username already in use')
                        }
                    })
        }),
    body('password')
        .trim(),
    body('role')
        .trim()
]

exports.validateForgotPassword = [
    body('username')
        .trim()
        .isEmpty()
        .withMessage('Enter a username'),
    body('password')
        .trim()
        .isEmpty()
        .withMessage('Enter a password'),
    body('confirmPassword')
        .trim()
        .isEmpty()
        .withMessage('Enter a password')
]
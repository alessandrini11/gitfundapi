const express = require('express');
const router = express.Router();
const adminController = require('../controller/Admin')
const { validateRegister, validateLogin, validateForgotPassword } = require('../middleware/validation/admin')
const isAuth = require('../middleware/isAuth')



router.post('/auth/register', validateRegister, adminController.register)
router.post('/auth/login', validateLogin, adminController.login)
router.post('/logout')
router.get('/',isAuth, adminController.getAll)
router.get('/:adminId', isAuth, adminController.getOne)
router.put('/auth/forgotpassword' , validateForgotPassword, adminController.updateOne)
router.put('/blockunblock/:adminId', adminController.blockUnblock)

module.exports = router
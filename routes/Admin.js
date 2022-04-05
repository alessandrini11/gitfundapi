const express = require('express');
const router = express.Router();
const adminController = require('../controller/Admin')

router.post('/auth/register', adminController.register)
router.post('/auth/login', adminController.login)
router.post('/logout')
router.get('/', adminController.getAll)
router.get('/:adminId', adminController.getOne)
router.put('/auth/forgotpassword',adminController.updateOne)
router.put('/blockunblock/:adminId', adminController.blockUnblock)

module.exports = router
const express = require('express');
const router = express.Router();
const specialityController = require('../controller/Speciality')

router.post('/',specialityController.create)
router.get('/',specialityController.getAll)
router.get('/:specialityId',specialityController.getOne)
router.put('/:specialityId',specialityController.updateOne)

module.exports = router
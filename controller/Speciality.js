const Speciality = require('../model/Speciality')
const { validationResult } = require('express-validator')


exports.create = (req, res, next) => {
    //verify access
    if(req.admin.role !== "super_admin"){
        const error = new Error('Only super admin cant perform this action')
        error.statusCode = 401
        throw error
    }

    //get the error if exist
    const errors = validationResult(req)
    //send errors to client
    if(!errors.isEmpty()){
        return res.status(422).json(errors)
    }

    const name = req.body.name

    const speciality = new Speciality({
        name
    })

    speciality.save()
        .then(speciality => {
            res.status(200).json({
                message: 'Speciality saved',
                speciality
            })
        })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
}

exports.getAll = (req, res, next) => {
    Speciality.find()
        .then(specialities => {
            res.status(200).json(specialities)
        })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
}

exports.getOne = (req, res, next) => {
    const specialityId = req.params.specialityId

    Speciality.findById(specialityId)
        .then(speciality => {
            if(!speciality){
                const error = new Error('Speciality not found')
                error.statusCode = 404
            }

            res.status(200).json(speciality)
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.updateOne = (req, res, next) => {
    //verify access
    if(req.admin.role !== "super_admin"){
        const error = new Error('Only super admin cant perform this action')
        error.statusCode = 401
        throw error
    }

    //get the error if exist
    const errors = validationResult(req)
    //send errors to client
    if(!errors.isEmpty()){
        return res.status(422).json(errors)
    }
    
    const specialityId = req.params.specialityId
    const name =req.body.name 

    Speciality.findById(specialityId)
        .then(speciality => {
            if(!speciality){
                const error = new Error('Speciality not found')
                error.statusCode = 404
            }
            speciality.name = name
            return speciality.save()

            
        })
        .then(speciality => {
            res.status(200).json({
                message: 'Speciality updated',
                speciality
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}
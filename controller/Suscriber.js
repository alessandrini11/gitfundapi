const Suscriber = require('../model/Suscriber')
const Sex = require('../model/Sex')
const Speciality = require('../model/Speciality')
const { validationResult } = require('express-validator')
const Deposit = require('../model/Deposit')
const path = require('path')
const fs = require('fs')

//function for clearing image
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, (error) => console.log(error))
}
const defaultMaleImage = 'public/images/suscribers/male.jpg'
const defaultFemaleImage = 'public/images/suscribers/female.jpg'


exports.create = (req, res, next) => {
    //verify access
    if(req.admin.role === "visitor"){
        const error = new Error('Only admin cant perform this action')
        error.statusCode = 401
        throw error
    }

    //get the error if exist
    const errors = validationResult(req)
    //send errors to client
    if(!errors.isEmpty()){
        return res.status(422).json(errors)
    }
    //user's input
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    let picture = req.file ? req.file.path : null
    const registrationNumber = req.body.registrationNumber
    const sex = req.body.sex
    const speciality = req.body.speciality

    let loadedSuscriber
    let loadedSex
    let loadedSpeciality


    //test for the presence of a picture
    /*if(!req.file){
        if(sex === '6246bb877111c1cc44df4d70'){
            picture = defaultMaleImage
        } else {
            picture = defaultFemaleImage
        }
    }*/
    const suscriber = new Suscriber({
        firstName,
        lastName,
        picture,
        registrationNumber,
        sex,
        speciality
    })

    Sex.findById(sex)
        .then(sex => {
            if(!sex){
                const error = new Error('No sex found')
                error.status = 404
                throw error
            }
            loadedSex = sex
            return Speciality.findById(speciality)
        })
        .then(speciality => {
            if(!speciality){
                const error = new Error('No speciality found')
                error.status = 404
                throw error
            }
            loadedSpeciality = speciality
            return suscriber.save()
        })
        .then(suscriber => {
            //add the suscriber id in the sex 
            loadedSex.suscribers.push(suscriber._id)
            loadedSex.save()
            //add the suscriber id in speciality
            loadedSpeciality.suscribers.push(suscriber._id)
            loadedSpeciality.save()
            res.status(201).json({
                message: 'Suscriber saved',
                suscriber
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.getAll = (req, res, next) => {
    Suscriber.find({ isVisibile: true})
        .populate('sex')
        .populate('speciality')
        .populate('deposits')
        .then(suscribers => {
            res.status(200).json({
                suscribers
            })
        })
        .catch(error => {
            if(error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })

}

exports.getOne = (req, res, next) => {
    const suscriberId = req.params.suscriberId
    let loadedSuscriber
    Suscriber.findById(suscriberId)
        .populate('deposits')
        .then(suscriber => {
            if(!suscriber){
                const error = new Error('No suscriber found')
                error.statusCode = 404
                throw error
            }
            if(suscriber.isVisibile === false){
                const error = new Error('Suscriber is blocked')
                error.statusCode = 401
                throw error
            }
            res.status(200).json(suscriber)
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
    if(req.admin.role === "visitor"){
        const error = new Error('Only admin cant perform this action')
        error.statusCode = 401
        throw error
    }
    //get the error if exist
    const errors = validationResult(req)
    //send errors to client
    if(!errors.isEmpty()){
        return res.status(422).json(errors)
    }
    //user input
    const suscriberId = req.params.suscriberId
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    let picture = req.file ? req.file.path : null
    const sex = req.body.sex
    const speciality = req.body.speciality

    // get the old suscriber, new suscriber , new sex, old sex, new speciality, old speciality
    //in order to compare them in case of any change
    let oldSuscriber
    let newSuscriber
    let newSex
    let oldSex
    let newSpeciality
    let oldSpeciality

    Suscriber.findById(suscriberId)
        .then(suscriber => {
            if(!suscriber){
                const error = new Error('No suscriber found')
                error.statusCode = 404
                throw error
            }
            //get the suscriber before update
            oldSuscriber = suscriber
            return Suscriber.findById(suscriberId)
        })
        .then(suscriber => {
            
            if(req.file){
                clearImage(suscriber.picture)
            }
            suscriber.firstName = firstName
            suscriber.lastName = lastName
            suscriber.sex = sex
            suscriber.speciality = speciality
            suscriber.picture = picture

            //get the suscriber after update
            newSuscriber = suscriber
            return suscriber.save()
        })
        .then(suscriber => {
            return Sex.findById(newSuscriber.sex)
        })
        .then(sex => {
            //get the sex after update
            newSex = sex
            return Sex.findById(oldSuscriber.sex)
        })
        .then(sex => {
            //get the sex before update
            oldSex = sex
            return Speciality.findById(newSuscriber.speciality)
        })
        .then(speciality => {
            //get the speciality after update
            newSpeciality = speciality
            return Speciality.findById(oldSuscriber.speciality)
        })
        .then(speciality => {
            //get the speciality before update
            oldSpeciality = speciality

            //if suscriber is not present in suscribers array of the choosen sex,
            //we add the suscriber to the 
            if(!newSex.suscribers.includes(newSuscriber._id)) {
                newSex.suscribers.push(newSuscriber)
                newSex.save()
                oldSex.suscribers.pull(newSuscriber)
                oldSex.save()
            } else {
                oldSex.suscribers.pull(newSuscriber)
                oldSex.save()
            }
            if(!newSpeciality.suscribers.includes(newSuscriber._id)) {
                newSpeciality.suscribers.push(newSuscriber)
                newSpeciality.save()
                oldSpeciality.suscribers.pull(newSuscriber)
                oldSpeciality.save()
            } else {
                oldSpeciality.suscribers.pull(newSuscriber)
                oldSpeciality.save()
            }
            return
        })
        .then(result => {
            res.status(200).json({
                message: 'Suscriber updated',
                suscriber: newSuscriber
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
        
}

exports.blockAndUnblock = (req, res, next) => {
    ///verify access
    if(req.admin.role === "visitor"){
        const error = new Error('Only admin cant perform this action')
        error.statusCode = 401
        throw error
    }

    const suscriberId = req.params.suscriberId
    Suscriber.findById(suscriberId)
        .then(suscriber => {
            if(!suscriber){
                const error = new Error('No suscriber found')
                error.statusCode = 404
                throw error
            }
            suscriber.isVisibile = !suscriber.isVisibile
            return suscriber.save()
        })
        .then(suscriber => {
            let message
            if(suscriber.isVisibile === true){
                message = 'Suscriber unblocked'
            } else {
                message = 'Suscriber blocked'
            }
            res.status(200).json({
                message
            })
            
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}
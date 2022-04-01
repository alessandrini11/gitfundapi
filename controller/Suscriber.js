const Suscriber = require('../model/Suscriber')
const Sex = require('../model/Sex')
const Speciality = require('../model/Speciality')
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
    if(!req.file){
        if(sex === '6246bb877111c1cc44df4d70'){
            picture = defaultMaleImage
        } else {
            picture = defaultFemaleImage
        }
    }
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
            loadedSex.suscribers.push(suscriber._id)
            loadedSex.save()
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
    Suscriber.find()
        .populate('sex')
        .populate('speciality')
        .populate('deposits')
        .then(suscribers => {
            const unLockedSuscribers = suscribers.filter(suscriber => {
                return suscriber.isVisibile === true
            })
            res.status(200).json({
                suscribers: unLockedSuscribers
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
    const suscriberId = req.params.suscriberId
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    let picture = req.file ? req.file.path : null
    const sex = req.body.sex
    const speciality = req.body.speciality

    let oldSuscriber
    let newSuscriber
    let newSex
    let oldSex
    let newSpeciality
    let oldSpeciality


    //test for the presence of a picture
    if(!req.file){
        if(sex === '6246bb877111c1cc44df4d70'){
            picture = defaultMaleImage
        } else {
            picture = defaultFemaleImage
        }
    }
    
    Suscriber.findById(suscriberId)
        .then(suscriber => {
            if(!suscriber){
                const error = new Error('No suscriber found')
                error.statusCode = 404
                throw error
            }
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

            newSuscriber = suscriber
            return suscriber.save()
        })
        .then(suscriber => {
            return Sex.findById(newSuscriber.sex)
        })
        .then(sex => {
            newSex = sex
            return Sex.findById(oldSuscriber.sex)
        })
        .then(sex => {
            oldSex = sex
            return Speciality.findById(newSuscriber.speciality)
        })
        .then(speciality => {
            newSpeciality = speciality
            return Speciality.findById(oldSuscriber.speciality)
        })
        .then(speciality => {
            oldSpeciality = speciality
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
            console.log(suscriber.isVisibile)
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
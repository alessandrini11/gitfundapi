const Admin = require('../model/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

exports.register = (req, res, next) => {
    //get the error if exist
    const errors = validationResult(req)
    //send errors to client
    if(!errors.isEmpty()){
        return res.status(422).json(errors)
    }

    const username = req.body.username
    const password = req.body.password
    const confrimPassword = req.body.confirmPassword
    const role = req.body.role

    if(password !== confrimPassword) {
        const error = new Error('The confirm password does not match the password')
        error.status = 422
        throw error
    }
    bcrypt.hash(password, 12)
        .then(hash => {
            const admin = new Admin({
                username,
                role,
                password: hash
            })

            return admin.save()
        })
        .then(admin => {
            res.status(201).json({
                message: 'Admin regsitered',
                admin
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.login = (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    let loadedAdmin
    Admin.findOne({username})
        .then(admin => {
            if(!admin){
                const error = new Error('No admin found')
                error.statusCode = 404
                throw error
            }
            if(admin.isBlocked === true){
                const error = new Error('The Admin was blocked')
                error.statusCode = 401
                throw error
            }
            loadedAdmin = admin
            return bcrypt.compare(password, admin.password)
        })
        .then(isEqual => {
            if(!isEqual) {
                const error = new Error('Incorrect password')
                error.statusCode = 403
                throw error
            }

            const token = jwt.sign(
                {
                    admin: loadedAdmin
                },
                process.env.SECRET_WORD,
                {
                    expiresIn: '2h'
                }
            )

            res.status(200).json({
                token
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
    //verify access
    if(req.admin.role !== "super_admin"){
        const error = new Error('Only super admin cant perform this action')
        error.statusCode = 401
        throw error
    }
    Admin.find()
        .then(admins => {
            res.status(200).json({
                admins
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.getOne = (req, res, next) => {
    const adminId = req.params.adminId

    if(req.admin.role !== "super_admin"){
        const error = new Error('Only admin cant perform this action')
        error.statusCode = 401
        throw error
    }
    Admin.findById(adminId)
        .then(admin => {
            if(!admin){
                const error = new Error('Admin not found')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                admin
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.updateOne = (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    let loadedAdmin
    Admin.findOne({username})
        .then(admin => {
            if(!admin){
                const error = new Error('No admin found')
                error.status = 404
                throw error
            }
            if(confirmPassword !== password){
                const error = new Error('The password and the confirm password are not the same')
                error.statusCode = 403
                throw error
            }
            loadedAdmin = admin
            return bcrypt.hash(password, 12)
        })
        .then(hash => {
            loadedAdmin.password = hash
            return loadedAdmin.save()
        })
        .then(admin => {
            res.status(200).json({
                message: 'the password has been updated'
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.blockUnblock = (req, res, next) => {
    if(req.admin.role !== "super_admin"){
        const error = new Error('Only admin cant perform this action')
        error.statusCode = 401
        throw error
    }
    const adminId = req.params.adminId

    Admin.findById(adminId)
        .then(admin => {
            if(!admin){
                const error = new Error('No admin found')
                error.statusCode = 404
                throw error
            }

            admin.isBlocked = !admin.isBlocked
            return admin.save()
        })
        .then(admin => {
            let message
            if(admin.isBlocked === false){
                message = 'admin is unblocked'
            } else {
                message = 'admin is blocked'
            }
            res.status(200).json({
                message,
                admin
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}
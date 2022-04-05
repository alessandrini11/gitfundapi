const Sex = require('../model/Sex')

exports.create = (req, res, next) => {
    //verify access
    if(req.admin.role !== "super_admin"){
        const error = new Error('Only super admin cant perform this action')
        error.statusCode = 401
        throw error
    }
    const name = req.body.name

    const sex = new Sex({
        name
    })

    sex.save()
        .then(sex => {
            res.status(201).json({
                message: 'Sex saved',
                sex
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
    if(req.admin.role === "visitor"){
        const error = new Error('Only admin cant perform this action')
        error.statusCode = 401
        throw error
    }
    Sex.find()
        .populate('suscribers')
        .then(sexs => {
            res.status(200).json({
                sexs
            })
        })
        .catch(error => {
            if(!statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.getOne = (req, res, next) => {
    //verify access
    if(req.admin.role === "visitor"){
        const error = new Error('Only admin cant perform this action')
        error.statusCode = 401
        throw error
    }
    const sexId = req.params.sexId

    Sex.findById(sexId)
        .populate('suscribers')
        .then(sex => {
            if(!sex){
                const error = new Error('No sex found')
                error.statusCode = 401
                throw error
            }
            res.status(200).json({
                sex
            })
        })
        .catch(error => {
            if(!statusCode){
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
    const sexId = req.params.sexId
    const name = req.body.name

    Sex.findById(sexId)
        .then(sex => {
            if(!sex){
                const error = new Error('No sex found')
                error.statusCode = 404
                throw error
            }

            sex.name = name
            return sex.save()
        })
        .then(sex => {
            res.status(200).json({
                message: 'Sex updated',
                sex
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}
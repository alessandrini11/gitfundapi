const Sex = require('../model/Sex')

exports.create = (req, res, next) => {
    const name = req.body.name

    const sex = new Sex({
        name
    })

    sex.save()
        .then(sex => {
            res.status(201).json({
                message: 'Sex saved successfully',
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
    Sex.find()
        .then(sexs => {
            res.status(200).json(sexs)
        })
        .catch(error => {
            if(!statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.getOne = (req, res, next) => {
    const sexId = req.params.sexId

    Sex.findById(sexId)
        .then(sex => {
            res.status(200).json(sex)
        })
        .catch(error => {
            if(!statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.updateOne = (req, res, next) => {
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
const Withdrawal = require('../model/Withdrawal')

exports.create = (req, res, next) => {
    const amount = req.body.amount
    const reason = req.body.reason

    const withdrawal = new Withdrawal({
        reason,
        amount
    })

    withdrawal.save()
        .then(withdrawal => {
            res.status(201).json({
                message: 'Withdrawal saved',
                withdrawal
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
    Withdrawal.find({isVisible: true})
        .then(withdrawals => {
            res.status(200).json({
                withdrawals
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
    const withdrawalId = req.params.withdrawalId

    Withdrawal.findById(withdrawalId)
        .then(withdrawal => {
            if(!withdrawal){
                const error = new Error('No withdrawal found')
                error.statusCode = 404
                throw error
            }
            if(withdrawal.isVisible === false){
                const error = new Error('The withdrawal is was deleted')
                error.statusCode = 401
                throw error
            }
            res.status(200).json(withdrawal)
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })

}

exports.updateOne = (req, res, next) => {
    const withdrawalId = req.params.withdrawalId
    const amount = req.body.amount
    const reason = req.body.reason

    Withdrawal.findById(withdrawalId)
        .then(withdrawal => {
            if(!withdrawal){
                const error = new Error('No withdraw found')
                error.status = 404
                throw error
            }
            if(withdrawal.isVisible === false){
                const error = new Error('The withdrawal is was deleted')
                error.statusCode = 401
                throw error
            }
            withdrawal.amount = amount
            withdrawal.reason = reason
            return withdrawal.save()
        })
        .then(withdrawal => {
            res.status(201).json({
                message: 'Withdrawal updated',
                withdrawal
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.deleteOne = (req, res, next) => {
    const withdrawalId = req.params.withdrawalId

    Withdrawal.findById(withdrawalId)
        .then(withdrawal => {
            if(!withdrawal){
                const error = new Error('No withdrawal found')
                error.statusCode = 404
                throw error
            }
            withdrawal.isVisible = false
            return withdrawal.save()
        })
        .then(withdrawal => {
            
            res.status(200).json({
                message: 'withdrawal deleted',
                withdrawal
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}
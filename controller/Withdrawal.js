const Withdrawal = require('../model/Withdrawal')

exports.create = (req, res, next) => {
    const amount = req.params.amount
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
    Withdrawal.find({isVisibile: true})
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
    let loadedSuscriber
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
            res.status(200).json(suscriber)
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })

}
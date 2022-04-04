const Suscriber = require('../model/Suscriber')
const Deposit = require('../model/Deposit')

exports.create = (req, res, next) => {
    const suscriber = req.body.suscriber
    const amount = req.body.amount

    const deposit = new Deposit({
        suscriber,
        amount
    })
    let newDeposit
    deposit.save()
        .then(deposit => {
            newDeposit = deposit
            return Suscriber.findById(suscriber)
        })
        .then(suscriber => {
            if(!suscriber){
                const error = new Error('No suscriber found')
                error.status = 404
                throw error
            }
            suscriber.deposits.push(newDeposit)
            return suscriber.save()
        })
        .then(suscriber => {
            res.status(201).json({
                message: 'Deposit saved',
                deposit: newDeposit
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
    Deposit.find({ isVisible: true })
        .populate('suscriber')
        .then(deposits => {
            res.status(200).json({
                deposits
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
    const depositId = req.params.depositId

    Deposit.findById(depositId)
        .populate('suscriber')
        .then(deposit => {
            if(!deposit){
                const error = new Error('No deposit found')
                error.statusCode = 404
                throw error
            }
            res.status(200).json(deposit)
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}

exports.updateOne = (req, res, next) => {
    const depositId = req.params.depositId
    const suscriber = req.body.suscriber
    const amount = req.body.amount

    let oldDeposit
    let newDeposit
    let oldSuscriber
    let newSuscriber

    Deposit.findById(depositId)
        .then(deposit => {
            if(!deposit){
                const error = new Error('No deposit found')
                error.statusCode = 404
                throw error
            }
            oldDeposit = deposit
            return Deposit.findById(depositId)
        })
        .then(deposit => {
            deposit.suscriber = suscriber
            deposit.amount = amount

            newDeposit = deposit
            return deposit.save()
        })
        .then(deposit => {
            
            return Suscriber.findById(oldDeposit.suscriber)
        })
        .then(suscriber => {
            oldSuscriber = suscriber
            return Suscriber.findById(newDeposit.suscriber)
        })
        .then(suscriber => {
            newSuscriber = suscriber
            if(!newSuscriber.deposits.includes(newDeposit._id)){
                newSuscriber.deposits.push(newDeposit)
                newSuscriber.save()
                oldSuscriber.deposits.pull(newDeposit)
                oldSuscriber.save()
            }
            return
        })
        .then(deposit => {
            res.status(200).json({
                message: 'Deposit updated',
                deposit: newDeposit
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
    const depositId = req.params.depositId

    Deposit.findById(depositId)
        .then(deposit => {
            if(!deposit){
                const error = new Error('No deposit found')
                error.statusCode = 404
                throw error
            }
            deposit.isVisible = false
            return deposit.save()
        })
        .then(deposit => {
            
            res.status(200).json({
                message: 'Deposit deleted',
                deposit
            })
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500
            }
            next(error)
        })
}
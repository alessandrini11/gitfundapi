const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader){
        const error = new Error('Not Authenticated')
        error.statusCode = 401
        throw error
    }
    const token = req.get('Authorization').split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_WORD)
    } catch (error) {
        error.statusCode = 500
        throw error
    }
    
    if(!decodedToken){
        const error = new Error('Not Authenticated')
        error.statusCode = 401
        throw error
    }

    if(decodedToken.admin){
        req.admin = decodedToken.admin
    }
    next()
}
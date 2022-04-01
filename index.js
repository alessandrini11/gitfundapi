const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const app = express();


//dot env
dotenv.config()


const corsOptions = {
    origin: '*',
    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ]
}

app.use(express.json())
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'))

//import routes
const sexRoutes = require('./routes/Sex')
const specialityRoutes = require('./routes/Speciality')

//use routes
app.use('/api/sexs',sexRoutes)
app.use('/api/specialities',specialityRoutes)

//error manager controller
app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({
        message,
        status
    })
})



app.listen(process.env.PORT, () => {
    console.log('app started on port ' + process.env.PORT)
})

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, () => {
    console.log('connected to mongo db')
    
})
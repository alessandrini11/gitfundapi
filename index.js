const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const app = express();


//dot env
dotenv.config()

//directory for building images
const fileStorageSusciber = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/suscribers')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

//reject files which do not have the following extensions
const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
//option for single suscriber's file upload
const option1 = multer({
    storage: fileStorageSusciber,
    fileFilter: fileFilter
}).single('picture')
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
app.use('/images',express.static(path.join(__dirname, '/public/images')))
app.use(morgan('dev'))

//import routes
const sexRoutes = require('./routes/Sex')
const specialityRoutes = require('./routes/Speciality')
const suscriberRoutes = require('./routes/Suscriber')

//use routes
app.use('/api/sexs',sexRoutes)
app.use('/api/specialities',specialityRoutes)
app.use('/api/suscribers',option1,suscriberRoutes)

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
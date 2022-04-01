const mongoose = require('mongoose');
const { Schema } = mongoose;
const SuscriberSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    sex: {
        type: Schema.Types.ObjectId,
        ref: 'Sex',
        required: true
    },
    speciality: {
        type: Schema.Types.ObjectId,
        ref: 'Speciality',
        required: true
    },
    isVisibile: {
        type: Boolean,
        default: true
    },
    deposits: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Deposit',
            required: true
        }
    ]

},
{ 
    timestamps: true
})

module.exports = mongoose.model('Suscriber', SuscriberSchema);
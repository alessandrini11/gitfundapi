const mongoose = require('mongoose');
const { Schema } = mongoose;
const SpecialitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    suscribers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Suscriber',
            required: true
        }
    ]

},
{ 
    timestamps: true
})

module.exports = mongoose.model('Speciality', SpecialitySchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;
const DepositSchema = new Schema({
    amout: {
        type: Number,
        required: true
    },  
    suscriber: {
        type: Schema.Types.ObjectId,
        ref: 'Suscriber',
        required: true
    }

},
{ 
    timestamps: true
})

module.exports = mongoose.model('Deposit', DepositSchema);
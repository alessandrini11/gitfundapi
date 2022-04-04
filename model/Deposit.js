const mongoose = require('mongoose');
const { Schema } = mongoose;
const DepositSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },  
    suscriber: {
        type: Schema.Types.ObjectId,
        ref: 'Suscriber',
        required: true
    },
    isVisible : { 
        type: Boolean,
        default: true
    }

},
{ 
    timestamps: true
})

module.exports = mongoose.model('Deposit', DepositSchema);
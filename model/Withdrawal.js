const mongoose = require('mongoose');
const { Schema } = mongoose;
const WithdrawalSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },  
    reason: {
        type: String,
        required: true
    },
    isVisible: {
        type: Boolean,
        default: true
    }
},
{ 
    timestamps: true
})

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
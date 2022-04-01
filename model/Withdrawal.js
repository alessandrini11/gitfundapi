const mongoose = require('mongoose');
const { Schema } = mongoose;
const WithdrawalSchema = new Schema({
    amout: {
        type: Number,
        required: true
    },  
    reason: {
        type: String,
        required: true
    }
},
{ 
    timestamps: true
})

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
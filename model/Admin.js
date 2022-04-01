const mongoose = require('mongoose');
const { Schema } = mongoose;
const AdminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'visitor'
    },
},
{ 
    timestamps: true
})

module.exports = mongoose.model('Admin', AdminSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: 'string',
        required: true
    },
    password:{
        type: 'string',
        required: true
    },
    Date:{
        type: Date,
        default:Date.now 
    }
});

const model = new mongoose.model('Users', UserSchema);

module.exports = model; 
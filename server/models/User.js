const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: {
        type:String,
        unique:true,
        lowercase:true,
        trim:true
    },
    full_name: {
        type:String,
        required: 'Add your full name !',
        trim:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    date_creation:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Users', usersSchema);

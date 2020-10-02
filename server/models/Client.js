const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientsSchema = new Schema({
    full_name: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        require: true
    },
    telephone: {
        type: String,
        trim: true
    },
    date_creation:{
        type:Date,
        default:Date.now()
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

module.exports = mongoose.model('Clients', ClientsSchema)
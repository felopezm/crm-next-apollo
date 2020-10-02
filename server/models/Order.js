const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
    order:{
        type: Array,
        required:true
    },
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required:true
    },
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    status:{
        type: String,
        default:"pending"
    },
    total:{
        type: Number,
        required:true
    },
    date_creation:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Orders', OrdersSchema)
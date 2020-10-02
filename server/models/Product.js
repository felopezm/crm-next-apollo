const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    stock:{
        type:Number,
        required:true,
        trim: true
    },
    price: {
        type: Number,
        trim: true
    },
    date_creation:{
        type:Date,
        default:Date.now()
    }
});

ProductsSchema.index({ name:'text'});

module.exports = mongoose.model('Products', ProductsSchema)
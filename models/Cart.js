const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CartSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    products:{
        type: Array
    },

    updated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("cart", CartSchema);



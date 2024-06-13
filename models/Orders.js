const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    address:{
        country:{
            type:String,
            default: null
        },

        city:{
            type:String,
            default: null
        },

        province:{
            type:String,
            default: null
        },
        
        detail:{
            type:String,
            default: null
        },
    },

    shipping:{
        type: String,
        enum: ["SHIPPED", "SHIPPING", "PACKING"],
        default: "SHIPPING"
    },

    payment:{
        type: String,
        enum: ["CASH", "CARD"]
    },

    products:{
        type: Array
    },
})


module.exports = mongoose.model("order", OrdersSchema);
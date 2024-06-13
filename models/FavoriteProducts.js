const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteProductsSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    
    favoriteId : {
        type: Schema.Types.ObjectId,
    },

    product:{
        type: Array
    }
})


module.exports = mongoose.model("favoriteproducts", FavoriteProductsSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteProductsSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    
    products:{
        type: Array
    }
})


module.exports = mongoose.model("favoriteProducts", FavoriteProductsSchema);

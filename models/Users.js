const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type: String,
        require: true,
        unique: true
    },

    password:{
        type: String,
        require: true
    },

    firstname:{
        type: String,
        require: true
    },

    lastname:{
        type: String,
        require: true
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
    

    createAt: {
        type: Date,
        default: Date.now
    },

    refreshToken:{
        type: String,
        default: null
    }
})

module.exports = mongoose.model('users', UserSchema);
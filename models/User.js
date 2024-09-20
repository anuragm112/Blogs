const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    profileImage:{
        type: String,
        required: true,
        default: ''
    }
});

const User=mongoose.model('User', UserSchema);
module.exports=User;
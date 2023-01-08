const mongoose = require('mongoose')
const{ObjectId} = mongoose.Schema.Types

const userSchema  = new mongoose.Schema({
    name:{
        type:"String",
        required: true,
    },
    email:{
        type:"String",
        required: true,
    },
    password:{
        type:"String",
        required: true,
    },
    followers:[{type:ObjectId , ref:"User"}],
    following:[{type:ObjectId , ref:"User"}],
    requests:[{type:ObjectId , ref:"User"}],
    requested:[{type:ObjectId , ref:"User"}],
    profilePhoto:{
        type:String,
        default:"https://res.cloudinary.com/dxuwjnsg5/image/upload/v1632921602/sbzqc1n4gjjdlzkpp5y3.jpg", 
    },
    coverPhoto:{
        type:String,
        default:"https://res.cloudinary.com/dxuwjnsg5/image/upload/v1632921736/mpfzmjzvvizp9usyeywh.jpg", 
    },
    resetToken:{type:String},
    expireToken:{type:String}
})


const User = mongoose.model('User',userSchema);

module.exports = User;
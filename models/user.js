const mongoose = require('mongoose')
const {ObjectId}= mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
         default:""
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
      }
})

mongoose.model("User", userSchema)
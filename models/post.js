const mongoose = require('mongoose')
const {ObjectId}= mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:true
    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
   
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    //   }
}, {timestamps:true})

mongoose.model("Post",postSchema)
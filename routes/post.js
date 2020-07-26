const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")






router.delete('/api/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

router.put('/api/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id firstname lastname")
    .populate("postedBy","_id firstname lastname")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/api/like', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id firstname lastname")
    .populate("postedBy","_id firstname lastname")
    .exec((error,result)=>{
        if(error){
            return res.status(422).json({error})
        }else{
            res.json(result)
        }
    })
})

router.put('/api/unlike', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id firstname lastname")
    .populate("postedBy","_id firstname lastname")
    .exec((error,result)=>{
        if(error){
            return res.status(422).json({error})
        }else{
            res.json(result)
        }
    })
})


router.get('/api/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id firstname lastname")
        .populate("comments.postedBy","_id firstname lastname")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(error => {
            console.log(error)
        })
})


router.get('/api/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id firstname lastname")  //Dito lang kinukuha yung specific na object sa User
        .populate("comments.postedBy","_id firstname lastname")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(error => {
            console.log(error)
        })
})



router.post('/api/createPost', requireLogin, (req, res) => {
    const { content, pic } = req.body
    if (!content || !pic) {
        return res.status(422).json({ error: "Please Fill to post" })
    }
    req.user.password = undefined
    // res.send("ok")
    const post = new Post({
        content,
        pic,
        postedBy: req.user
    })
    post.save()
        .then(result => {
            res.json({ post: result })
        })
        .catch(error => {
            console.log(error)
        })
})

module.exports = router
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt= require('bcryptjs')
const webtoken = require('jsonwebtoken')
const {JWT_SECRET}= require('../key')
const requireLogin = require('../middleware/requireLogin')


router.get('/protected',requireLogin, (req, res)=>{
    res.send("hello po")
})


router.post('/api/signup', (req, res) => {
    const {firstname,lastname,email,password} = req.body
    if (!email || !password || !firstname||!lastname) {
        return res.status(422).json({error: "Add all fields!"})
    }else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error: "Invalid Email"})
    }
    User.findOne({email: email}).then((foundUser) => {
            if (foundUser) {
                return res.status(422).json({error: "User Exist"})
            }
            bcrypt.hash(password,12)
            .then(hashedPassword=>{
                const user = new User({
                    firstname,
                    lastname,
                    password:hashedPassword,
                    email
                })
                user.save()
                    .then(user => {res.json({message: "sucess"})})
            })
            .catch(err => {
                console.log(err)
            })
    })

        .catch(err => {
            console.log(err)
        })
})



router.post('/api/signin', (req, res)=>{
    const {email,password}=req.body
    if (!email||!password){
        return res.status(422).json({error: "Add all fields!"})
    }
    User.findOne({email:email})
    .then((foundUser)=>{
        if(!foundUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        bcrypt.compare(password,foundUser.password)
        .then(matched=>{
            if(matched){
                // res.json({message:"sign in success"})
                const token = webtoken.sign({_id:foundUser._id},JWT_SECRET)
                const {_id,firstname,lastname,email}=foundUser
                res.json({token,user:{_id,firstname,lastname,email}})
            }
            else{
                return res.status(422).json({error:"Invalid Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


module.exports = router
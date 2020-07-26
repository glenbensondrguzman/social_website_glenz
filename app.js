const express = require('express')
const app = express()
const PORT = 5000
const mongoose =require('mongoose')
const {MONGOURI} = require('./key')


require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))




mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})


mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})
mongoose.connection.on('error',(err)=>{
    console.log("errorsss connecting", err)
})


app.listen(PORT, ()=>{
    console.log("Hello pows")
})
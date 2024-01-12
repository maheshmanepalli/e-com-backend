const express = require('express');
const app = express()
const port = 7171;
const userRoutes = require('./views/users')
const mongoose = require('mongoose');
const cors = require('cors')

app.use(cors())

app.use(express.json());

app.use(userRoutes)

mongoose.connect(`mongodb://127.0.0.1:27017/`)
.then( ()=>{console.log("DB is connected")})
.catch( ()=>{console.log("DB connection failed")})

app.use("*",(req,res)=>{
    res.send("error not found")
})

app.listen( port, ()=>{
    console.log(`server started at port ${port}`)
})
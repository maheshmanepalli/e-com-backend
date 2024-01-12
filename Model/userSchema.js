const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    }
})


module.exports = new mongoose.model("usersData123",userModel)
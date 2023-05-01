const mongoose = require('mongoose');
// const conn = require('..config/db');

var otpSchema = new mongoose.Schema({
    email:String,
    code:String,
    expireIn:Number
},{
    timestamps:true
})

let Otp = mongoose.model('otp', otpSchema, 'otp');

module.exports = Otp;
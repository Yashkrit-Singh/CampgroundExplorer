const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose);  // to plug in username and password inside schema makes it required true and unique

module.exports = mongoose.model('User', userSchema);
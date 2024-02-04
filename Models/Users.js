const mongoose= require("mongoose")
const bcrypt = require("bcrypt")


const UserSchema= new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar:{
        type:String,
    },
    createdAt: { type: Date, default: Date.now } 
    



})
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


const User= mongoose.model("User",UserSchema)

module.exports=User



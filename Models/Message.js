const mongoose= require("mongoose")
const User=require("./Users.js")

const MessageSchema= new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{type:String},
    timestamp: {
        type: Date,
        default: Date.now // Default to current date and time
    },
        image:{type:String},
    deleteAt: {
        type: Date,
        default: null  // The default value is set to null
    }

})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
const mongoose= require("mongoose");

let userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["user","manager"]
    },
    book:{
        issuebook:[{
        }],
        returnbook:[{
        }]
    }
});

module.exports=mongoose.model("User",userSchema);
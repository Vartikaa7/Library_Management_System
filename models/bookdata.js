let mongoose=require("mongoose");
let bookSchema=mongoose.Schema({
    Sno:{
        type:Number,
        required:true
    },
    Bookname:{
        type:String,
        required:true

    },
    Author:{
        type:String
    },
    stock:{
        type:Number,
        required:true
    }
});
const BookData=mongoose.model("BookData",bookSchema);


module.exports=BookData;
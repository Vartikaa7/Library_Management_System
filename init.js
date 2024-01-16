const mongoose = require('mongoose');
const BookData=require("./models/bookdata.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/library');
}
main().then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log("error",err)
});

BookData.insertMany([
    {
        Sno:1,
        Bookname:"Pride and Prejudice",
        Author:"Jane Austen",
        stock:15
    },
    {
        Sno:2,
        Bookname:"Jane Eyre",
        Author:"Charlotte Bronte",
        stock:3 
    },
    {
        Sno:3,
        Bookname:"1984",
        Author:"George Orwell",
        stock:0
    }
]).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
});
const express=require("express");
const app= express();

const methodoverride=require("method-override");
app.use(methodoverride("_method"));
const cookieParser = require("cookie-parser");

const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.json());
//mongodb connection 
let url= 'mongodb://localhost:27017/library_management_system';
let {connection}=require("./connection");
connection(url).then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log("error",err);
});

//starting a server
port=2020;
app.listen(port,()=>{
    console.log("server is listening");
});

let router= express.Router();
app.use("/",router);
router.get("/",(req,res)=>{
    res.redirect("/user/Signin");
});

//router
let userRouter= require("./router/user");
app.use("/user",userRouter);

let bookRouter= require("./router/bookdata");
app.use("/book",bookRouter);
const express=require("express");
const app= express();
const methodoverride=require("method-override");
app.use(methodoverride("_method"));
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");

const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("views engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

const mongoose = require('mongoose');
const BookData = require("./models/bookdata");
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/library');
}
main().then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log("error",err)
});

const User= require("./models/user");
const Manager=require("./models/manager");

app.listen(3030,()=>{
    console.log("server is listening");
});
app.get("/",(req,res)=>{
    res.render("home.ejs");
});
let c;

app.get("/addbook",(req,res)=>{
    res.render("addbook.ejs");
})

// Add new Book
app.post("/books_details",async (req,res)=>{
    let {Bookname,Author,stock}=req.body;
    const lastDocument = await BookData.findOne({}).sort({ Sno: -1 }).select("Sno");
    let s=lastDocument.Sno+1;
    let data= new BookData({
        Sno:s,
        Bookname:Bookname,
        Author:Author,
        stock:stock
    });
    await data.save();
    res.redirect("/books_detail");
    
});

//login/Signin

app.get("/Signin",(req,res)=>{
    res.render("signin_login.ejs");
});

app.post("/Signin",(req,res)=>{
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    let {username,email,password,confpass}=req.body;
    if (password === confpass){
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                console.error(err);
            } else {
                console.log('Hashed Password:', hash);
                console.log("salt",salt);
                let data= new User({
                    username:username,
                    email:email,
                    password:hash,
                    salt:salt,
                    role:"user"
                }).save().then((res)=>{
                    console.log(res);
                }).catch((err)=>{
                    console.log(err);
                });
                res.redirect("/login");
            }
            
        });
        
    }else{
        res.send("password not match");
    }
});

app.get("/SigninManager",(req,res)=>{
    res.render("SigninManager.ejs");
});

app.post("/SigninManager",async (req,res)=>{
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    let {username,email,password,confpass,tokenkey}=req.body;
    if (password === confpass){
        let TokenKey="1234";
        if (TokenKey==tokenkey){
            try {
                const existUser = await User.findOne({email});
                if (!existUser) {
                    let data= new Manager({
                        username:username,
                        email:email,
                        password:password
                    }).save().then((res)=>{
                        console.log(res);
                    }).catch((err)=>{
                        console.log(err);
                    });
                    res.redirect("/books_detail");
                }else{
                    if (existUser.username === username && existUser.password === password) {
                        res.redirect("/books_detail");
                    }else{
                        res.send("Invalid ..!")
                    }
                }
            }catch(err){
                console.log(err);
            }
        }else{
        res.send("Invalid Token Key");
    }
    }else{
        res.send("Password Not match");
    }
    
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.post("/login", async (req,res)=>{
    let {email,password}=req.body;
    const user=await User.findOne({email})
    console.log(user);
    let salt=user.salt;
    let hashpass=user.password;
    const hashedAttempt = bcrypt.hashSync(password, salt);
    if (hashpass===hashedAttempt){
        const payload= JSON.stringify(user);
        const secretKey = '1234';
        const token = jwt.sign(payload, secretKey);
        console.log(token);
        res.cookie('jwtToken', token, { httpOnly: true });
        res.redirect(`/books_detail/user/${user._id}`);
    }else{
        res.send("password not match");
    }
});

app.get("/books_detail/user/:id",async (req,res)=>{
    let {id}=req.params;
    let user= await User.findById(id);
    // console.log(user);
    let bookdatas=await BookData.find({});
    res.render("books_detail.ejs",{bookdatas,user});
});

//Delete Route

app.delete("/books_detail/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedbook= await BookData.findByIdAndDelete(id);
    console.log(deletedbook);
    res.redirect("/books_detail");
});

app.get("/editbook/:id",async (req,res)=>{
    let {id}=req.params;
    let data=await BookData.findById(id);
    res.render("editbook.ejs",{data});
})
app.put("/books_detail/:id",async (req,res)=>{
    let {id}=req.params;
    let {bookname,Author,stock}=req.body;
    let updateddata=await BookData.findByIdAndUpdate(id,{Bookname:bookname,Author:Author,stock:stock},{runValidators:true,new:true});
    console.log(updateddata);
    res.redirect("/books_detail");
});

//isuue book
app.get("/issuebook/:id", async (req,res)=>{
    let {id}=req.params;
    let data= await BookData.findById(id);
    let updateddata=await BookData.findByIdAndUpdate(id,{stock:data.stock-1},{runValidators:true,new:true});
    console.log(updateddata);
    res.redirect("/books_detail");

})
app.get("/returnbook/:id", async (req,res)=>{
    let {id}=req.params;
    let data= await BookData.findById(id);
    let updateddata=await BookData.findByIdAndUpdate(id,{stock:data.stock+1},{runValidators:true,new:true});
    console.log(updateddata);
    res.redirect("/books_detail");

})
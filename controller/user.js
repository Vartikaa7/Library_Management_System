const User= require("../models/user");
let bcrypt= require("bcrypt");
let {setUser} = require("../service/auth");




let Signinpage= (req,res,next)=>{
        res.render("signin_login.ejs");
};

let Signin= async (req,res,next)=>{
    let {username,email,password,confpass}=req.body;
        if (password === confpass){
            let existUser=await User.findOne({email});
            if(existUser){
                res.status(400).json({message:"User already exist..! Login instead"});
            };
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            bcrypt.hash(password, salt, function(err, hash) {
                new User({
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
            });
            res.render("login.ejs");

        }else{
            res.status(400).json({message:"Password not match"});
        }
};

let SigninManagerPage= (req,res,next)=>{
    res.render("SigninManager.ejs");
};

let SigninManager= async (req,res,next)=>{
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    let {username,email,password,confpass,tokenkey}=req.body;
    if (password === confpass){
        let TokenKey="1234";
        if (TokenKey==tokenkey){
            try {
                const existUser = await User.findOne({email});
                if (!existUser) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        new User({
                            username:username,
                            email:email,
                            password:hash,
                            salt:salt,
                            role:"manager"
                        }).save().then((res)=>{
                            console.log(res);
                        }).catch((err)=>{
                            console.log(err);
                        });   
                    });
                    res.render("/books_detail");
                }else{
                    res.status(400).json({message:"Email already exist"});
                    }
            }catch(err){
                console.log(err);
            }
        }else{
            res.status(400).json({message:"Invalid Token key"});
    }
    }else{
        res.status(400).json({message:"Password not match"});
    }
    
};

let loginpage= async (req,res,next)=>{
    res.render("login.ejs");
};

let login= async (req,res,next)=>{
    let {email,password}=req.body;
    const user = await User.findOne({ email});
  
    if (!user){
      return res.render("login", {
        error: "Invalid Username or Password",
      });
    }else{
        let salt=user.salt;
        let hashpass=user.password;
        const hashedAttempt = bcrypt.hashSync(password, salt);
        if(hashedAttempt==hashpass){
            let token=setUser(user);
            res.cookie("uid", token, { maxAge: 3600000 });
            return res.redirect("/book/books_detail");
        }else{
            return res.render("login", {
            error: "Invalid Username or Password",
        })};
    };
};

module.exports={Signinpage,Signin,SigninManagerPage,SigninManager,loginpage,login};
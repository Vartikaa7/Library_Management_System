let express= require("express");
let {Signinpage,Signin,SigninManagerPage,SigninManager,loginpage,login}=require("../controller/user");

let router= express.Router();



router.get("/Signin",Signinpage);
router.post("/Signin",Signin);

router.get("/SigninManager",SigninManagerPage);
router.post("/SigninManager",SigninManager);

router.get("/login",loginpage);
router.post("/login",login);

module.exports= router;
let express= require("express");

let router= express.Router();
let {bookdata,deletebook,editbook,geteditbook,issuebook,returnbook,addbook,addbookdetail}=require("../controller/bookdata");

router.get("/addbook",addbook);
router.post("/addbook",addbookdetail);
router.get("/books_detail", bookdata);
router.delete("/books_detail/:id",deletebook);

router.get("/editbook/:id",editbook);
router.put("/books_detail/:id",geteditbook);

router.get("/issuebook/:id",issuebook);
router.get("/returnbook/:id",returnbook);

module.exports=router;
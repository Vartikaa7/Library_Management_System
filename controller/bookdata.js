let BookData= require("../models/bookdata");
let User= require("../models/user");
let {setUser,getUser}= require("../service/auth");



let bookdata=async (req,res,next)=>{
    const userUid = req.cookies?.uid;
    let user;
    if (userUid){
        const  payload= getUser(userUid);
        user= await User.findById(payload._id);
    }
    let bookdatas=await BookData.find({});
    console.log(user);
    res.render("books_detail.ejs",{bookdatas,user}); 
};
//add book 
let addbook= (req,res,next)=>{
    res.render("addbook.ejs");
}
let addbookdetail= async (req,res,next)=>{
    let {Bookname,Author,stock}=req.body;
    if (!Bookname || !Author || !stock) {
        return res.status(400).json({ message: 'Please provide all required details.' });
    };
    const lastDocument = await BookData.findOne({}).sort({ Sno: -1 }).select("Sno");
    let Sno=lastDocument.Sno+1;
    let newBook = new BookData({Sno,Bookname,Author,stock,});
    await newBook.save();
    res.redirect("/book/books_detail");

}
//Delete Route

let deletebook=async (req,res,next)=>{
    let {id}=req.params;
    let deletedbook= await BookData.findByIdAndDelete(id);
    console.log(deletedbook);
    res.redirect("/book/books_detail");
};

let editbook= async (req,res,next)=>{
    let {id}=req.params;
    let data=await BookData.findById(id);
    res.render("editbook.ejs",{data});
};
let geteditbook= async (req,res,next)=>{
    let {id}=req.params;
    let {bookname,Author,stock}=req.body;
    let updateddata=await BookData.findByIdAndUpdate(id,{Bookname:bookname,Author:Author,stock:stock},{runValidators:true,new:true});
    console.log(updateddata);
    res.redirect("/book/books_detail");
};

//isuue book
let issuebook= async (req,res,next)=>{
    let {id}=req.params;
    const userUid = req.cookies?.uid;
    if (!userUid){
        return res.status(400).json({"message":"not login"});
    }
    const  payload= getUser(userUid);
    let user= await User.findById(payload._id);
    let data= await BookData.findById(id);
    if (data.stock<=0){
        return res.status(400).json({"massage":"can not able to issue book"});
    }
    data.stock=data.stock-1;
    user.book.issuebook.push({
        bookid: id,
        date: new Date()
    });
    await Promise.all([data.save(), user.save()]);

    res.redirect("/book/books_detail");

};
let returnbook= async (req,res,next)=>{
    let {id}=req.params;
    const userUid = req.cookies?.uid;
    if (!userUid){
        return res.status(400).json({"message":"not login"});
    }
    const  payload= getUser(userUid);
    let user= await User.findById(payload._id);
    let data= await BookData.findById(id);
    data.stock=data.stock+1;
    user.book.issuebook.push({
        bookid: id,
        date: new Date()
    });
    await Promise.all([data.save(), user.save()]);

    res.redirect("/book/books_detail");

};

module.exports={bookdata,deletebook,editbook,geteditbook,issuebook,returnbook,addbook,addbookdetail};
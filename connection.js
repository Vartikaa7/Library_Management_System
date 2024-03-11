const mongoose = require('mongoose');
const BookData = require("./models/bookdata");
async function connection(url){
   return await mongoose.connect(url);
}
module.exports={connection};



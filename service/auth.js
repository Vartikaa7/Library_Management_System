let jwt= require("jsonwebtoken");

let secretkey="vartika@45"
function setUser(user) {
  let payload= {
    _id: user._id,
    email:user.email
  }
  let token= jwt.sign(payload,secretkey);
  return token;
}

function getUser(token) {
  if (!token) return null;
  try{
    return jwt.verify(token,secretkey);
  }catch{
    return null;
  }
  
}

module.exports = {setUser,getUser};
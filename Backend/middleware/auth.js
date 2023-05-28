const jwt = require('jsonwebtoken');
const User = require('../models/users')



const authenticate = (req,res,next) =>{
    try {
        const token =req.header("Authorization");
        // console.log(token);
        const user = jwt.verify(token,'1234565');
        // console.log('userId >>>>>', user.userId)
        User.findByPk(user.userId).then(user=>{
        // console.log(JSON.stringify(user));
       
        req.user= user; // global obj common among both function flowing from one fn to next req would be common
        // console.log(user)
        next();
    })
    .catch(err => {throw new Error(err)})

} catch(err) {
    console.log(err);
    return res.status(401).json({sucess: false})
}
}

module.exports = {
    authenticate
}
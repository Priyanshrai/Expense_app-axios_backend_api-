const Sequelize = require("sequelize")
const UserDetails= require("../models/users");
const bcrypt = require('bcrypt');

const addUser = async (req,res,next) => {
    try {
        const {name,email,password} = req.body;
        // if(isstringinvalid(name)|| isstringinvalid(email || isstringinvalid (password))){
        //   return res.status(400).json({err: "Bad Parameters . something is missing"})
        // }

        const saltRounds=10;
        bcrypt.hash(password, saltRounds , async (err,hash)=>{
          console.log(err)
        await UserDetails.create ({name,email,password: hash});
        res.status(201).json({message: "Sucessfully Create New User"});
      })
    }
    catch (err) {
        
            if (err instanceof Sequelize.UniqueConstraintError) {
              res.status(400).json({ error: 'Email already exists' });
            } else {
              res.status(500).json({ error: err });
            }
    }
}


const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserDetails.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
   
    if (!passwordMatch) {
      return res.status(404).json({ error: 'Invalid password' });
    }
   
    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addUser,
  loginUser
};
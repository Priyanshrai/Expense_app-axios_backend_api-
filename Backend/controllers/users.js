const Sequelize = require("sequelize")
const UserDetails= require("../models/users");
const bcrypt = require('bcrypt');

const addUser = async (req,res,next) => {
    try {
        const name= req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await UserDetails.create ({
            name : name,
            email : email,
            password:password
        });
        res.status(201).json({newUserDetail: data});
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
      return res.status(404).json({ error: 'Invalid email or password' });
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
const Sequelize = require("sequelize")
const UserDetails= require("../models/users");
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

module.exports = {
    addUser
};
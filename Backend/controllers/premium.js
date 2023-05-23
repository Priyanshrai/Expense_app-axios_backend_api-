const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('sequelize');
// const Sequelize = require('../util/database');


const getPremium=async (req, res) => {
    try {
      const leaderboardofusers=await User.findAll({
        attributes: ['id','name',[sequelize.fn('sum',sequelize.col('Expenses')),'total_cost']],
        include:[
          {
            model:Expense,
            attributes:[]
          }
        ],
        group:['users.id'],
        order:[['total_cost','DESC']]
      
      
      });
       
     res.status(200).json(leaderboardofusers)
    
} catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Something went wrong", error: err });
    }
}
module.exports={getPremium};
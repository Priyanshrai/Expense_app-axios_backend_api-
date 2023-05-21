const User = require('../models/users');
const Expense = require('../models/expenses');
const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const getPremium=async (req, res) => {
    try {
      const user=await User.findAll();
      const expenses=await Expense.findAll();
     
      const userAggregatedExpenses={}
      
      expenses.forEach((Expense)=>{
        if(userAggregatedExpenses[Expense.userId]){
          userAggregatedExpenses[Expense.userId] = userAggregatedExpenses[Expense.userId]+parseFloat(Expense.Expenses)
        }else {
          userAggregatedExpenses[Expense.userId] = parseFloat(Expense.Expenses)
        }
      })

      const userLeaderBoardDetails=[];
      user.forEach((user)=>{
        userLeaderBoardDetails.push({name: user.name,total_cost:userAggregatedExpenses[user.id]})
      })
console.log(userLeaderBoardDetails)
userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
res.status(200).json(userLeaderBoardDetails)

    
} catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Something went wrong", error: err });
    }
}
module.exports={getPremium};
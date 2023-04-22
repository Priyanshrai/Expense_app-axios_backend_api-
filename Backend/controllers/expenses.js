const expense = require("../models/expenses");
const addExpense = async (req,res,next) => {
    try {
        if(req.body.number) {
            throw new Error ("Phone Number is Mandatory");
        }
        const Expenses = req.body.Expenses;
        const Description = req.body.Description;
        const Category = req.body.Category;

        const data = await expense.create ({
            Expenses : Expenses,
            Description : Description,
            Category : Category
        });
        res.status(201).json({newExpenseDetail: data});
    }
    catch (err) {
        res.status(500).json({
            error:err,
        });
    }
}
const getExpense = async (req, res, next) => {
    try {
      const expenses = await expense.findAll();
      res.status(200).json({ allUsers: expenses });
      console.log(expenses)
    } catch (error) {
      console.log("Get Expense is Failing", JSON.stringify(error));
      res.status(500).json({ error: error });
    }
  }

const deleteExpense =  async (req, res) => { 
    try {
      
      if (req.params.id == "undefined") {
        console.log("ID is Missing");
        return res.status(400).json({ err: "ID is missing" });
      }
      const uId = req.params.id;
      await expense.destroy({ where: { id: uId } });
      res.sendStatus(200);
    } 
    
    catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  }

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
}
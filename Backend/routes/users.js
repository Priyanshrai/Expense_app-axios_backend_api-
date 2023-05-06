const express = require("express");
const router=express.Router();

const usersController=require("../controllers/users")

router.post("/add-user", usersController.addUser)
// router.get("/get-expense", expenseController.getExpense);
// router.delete("/delete-expense/:id", expenseController.deleteExpense);

module.exports=router;
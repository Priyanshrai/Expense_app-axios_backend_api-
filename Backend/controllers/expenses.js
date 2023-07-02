const expense = require("../models/expenses");
const User = require("../models/users");
const sequelize = require("../util/database");
const AWS = require('aws-sdk');

function uploadToS3(data,filename){
const BUCKET_NAME='';
const IAM_USER_KEY = '';
const IAM_USER_SECRET = '';
}

const downloadexpense = async (req,res) => {
const expenses = await req.user.getExpenses();
console.log(expenses);
const stringifiedExpenses = JSON.stringify(expenses);
const filename = 'Expense.txt';
const fileURL = uploadToS3(stringifiedExpenses,filename);
res.status(200).json({fileURL,success:true})
}



const addExpense = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { Expenses, Description, Category } = req.body;

    if (Expenses === undefined || Expenses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Parameters Missing" });
    }

    const createdExpense = await expense.create(
      {
        Expenses,
        Description,
        Category,
        userId: req.user.id,
      },
      { transaction: t }
    );

    const totalExpense = Number(req.user.totalExpense) + Number(Expenses);

    await User.update(
      {
        totalExpense: totalExpense,
      },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );
    await t.commit();
    res.status(200).json({ newExpenseDetail: createdExpense });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, error: err });
  }
};

const getExpense = async (req, res, next) => {
  try {
    // console.log(req.user.id)
    const expenses = await expense.findAll({ where: { userId: req.user.id } });

    res.status(200).json({ allExpenses: expenses });
    // console.log(expenses)
  } catch (error) {
    console.log(error);
    console.log("Get Expense is Failing", JSON.stringify(error));
    res.status(500).json({ error: error });
  }
};

const deleteExpense = async (req, res) => {
  try {
    if (req.params.id === undefined) {
      console.log("ID is Missing");
      return res.status(400).json({ err: "ID is missing" });
    }

    const uId = req.params.id;

    const t = await sequelize.transaction();

    try {
      const expensetobedeleted = await expense.findAll({
        where: { id: uId, userId: req.user.id },
        transaction: t,
      });

      const totalExpense1 =
        Number(req.user.totalExpense) - Number(expensetobedeleted[0].Expenses);
      console.log(totalExpense1);
      req.user.totalExpense = totalExpense1;
      await req.user.save({ transaction: t });

      const noOfRows = await expense.destroy({
        where: { id: uId, userId: req.user.id },
        transaction: t,
      });

      if (noOfRows === 0) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, message: "Expense Doesn't Belong To User" });
      }

      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: "Deleted Successfully" });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Failed" });
  }
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
  downloadexpense,
};

const expense = require("../models/expenses");
const User = require("../models/users");


const addExpense = async (req, res, next) => {
  const { Expenses, Description, Category } = req.body;

  try {
    if (Expenses === undefined || Expenses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Parameters Missing" });
    }

    const createdExpense = await expense.create({
      Expenses,
      Description,
      Category,
      userId: req.user.id,
    });

    const totalExpense = Number(req.user.totalExpense) + Number(Expenses);
    console.log(totalExpense);

    await User.update(
      {
        totalExpense: totalExpense,
      },
      {
        where: { id: req.user.id },
      }
    );

    res.status(200).json({ newExpenseDetail: createdExpense });
  } catch (err) {
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

const deleteExpense = (req, res) => {
  if (req.params.id == "undefined") {
    console.log("ID is Missing");
    return res.status(400).json({ err: "ID is missing" });
  }

  const uId = req.params.id;
  expense
    .destroy({ where: { id: uId, userId: req.user.id } })
    .then((noOfRows) => {
      if (noOfRows === 0) {
        return res
          .status(404)
          .json({ sucess: false, message: "Expense Doesnt Belongs To user" });
      }
      return res
        .status(200)
        .json({ sucess: true, message: "Delete Sucessfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ sucess: true, message: "Failed" });
    });
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
};

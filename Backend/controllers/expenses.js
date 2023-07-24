const expense = require("../models/expenses");
const User = require("../models/users");
const sequelize = require("../util/database");

const UserServices = require('../services/userservices')

const S3Service =  require ('../services/S3services')



const downloadexpense = async (req,res) => {

  try{
    
    if(!req.user.ispremiumuser){
      return res.status(401).json({ success: false, message: 'User is not a premium User'})
  }


const expenses = await UserServices.getExpenses(req);
console.log(expenses);
const stringifiedExpenses = JSON.stringify(expenses);

//it Should depend upon the userid
const userid = req.user.id;

const filename = `Expense${userid}/${new Date()}.txt`;
const fileURL = await S3Service.uploadToS3(stringifiedExpenses,filename);
console.log(fileURL);
res.status(200).json({fileURL,success:true})

} catch(err){
  console.log(err);
res.status(500).json({fileURL: '',success: false, err:err })
}
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

const ITEMS_PER_PAGE = 2;

const getExpense = async (req, res, next) => {
  const page = +req.query.page || 1;
  try {
    // Fetch the total number of items in the database table
    const totalItems = await expense.count();

    const expenses = await expense.findAll({
      offset: (page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
    });

    res.status(200).json({
      allExpenses: expenses,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
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


const express = require('express');
const bodyParser = require("body-parser");


const sequelize = require("./util/database");
var cors = require("cors");
//env
const dotenv = require("dotenv");
dotenv.config();

//models
const User = require("./models/users")
const Expense = require("./models/expenses")
const Order=require("./models/orders")
const Forgotpassword = require('./models/forgotPassword');

const app=express();
app.use(cors());

//routes
const expenseRoutes=require("./routes/expenses")
const userRoutes=require("./routes/users")
const orderRoutes=require("./routes/purchase")
const premiumRoutes=require("./routes/premium")
const resetPasswordRoutes = require('./routes/resetPassword')

// app.use(bodyParser.urlencoded()); //this is for handling forms
app.use(express.json()); //this is for handling jsons



app.use('/expense',expenseRoutes);
app.use("/users",userRoutes)
app.use('/purchase',orderRoutes)
app.use("/premium",premiumRoutes)
app.use('/password', resetPasswordRoutes);





//association
User.hasMany(Expense);
Expense.belongsTo(User)


User.hasMany(Order);
Order.belongsTo(User)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
       //console.log(result);
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

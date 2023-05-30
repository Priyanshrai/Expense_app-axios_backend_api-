const express=require('express');
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
var cors = require("cors");
//env
const dotenv = require("dotenv");
dotenv.config();


const app=express();
app.use(cors());

//routes
const expenseRoutes=require("./routes/expenses")
const userRoutes=require("./routes/users")
const orderRoutes=require("./routes/purchase")
const premiumRoutes=require("./routes/premium")
const resetPasswordRoutes = require('./routes/resetPassword')

//app.use(bodyParser.erlencoded()); //this is for handling forms
app.use(express.json()); //this is for handling jsons
app.use(bodyParser.json()); 


app.use('/expense',expenseRoutes);
app.use("/users",userRoutes)
app.use('/purchase',orderRoutes)
app.use("/premium",premiumRoutes)
app.use('/password', resetPasswordRoutes);

app.use(errorController.get404);

//models
const User = require("./models/users")
const Expense = require("./models/expenses")
const Order=require("./models/orders")
const Forgotpassword = require('./models/forgotPassword');

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
    //    console.log(result);
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

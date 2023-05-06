

const express=require('express');
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
var cors = require("cors");


const app=express();
app.use(cors());


const expenseRoutes=require("./routes/expenses")
const userRoutes=require("./routes/users")

app.use(bodyParser.json());


app.use('/expense',expenseRoutes);
app.use("/users",userRoutes)

app.use(errorController.get404);

sequelize
  .sync()
  .then((result) => {
    //    console.log(result);
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

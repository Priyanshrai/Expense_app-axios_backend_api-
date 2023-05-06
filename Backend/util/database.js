const Sequelize = require("sequelize")

const sequelize = new Sequelize ('expenses','root','password',
{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize;


const Sequelize = require("sequelize")

const sequelize = new Sequelize ('expenses','root','',
{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize;

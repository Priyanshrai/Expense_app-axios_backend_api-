
const Sequelize=require('sequelize');
const sequelize=require("../util/database");

const UserDetails = sequelize.define ('users',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Add unique constraint to email field
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }

})
module.exports = UserDetails;
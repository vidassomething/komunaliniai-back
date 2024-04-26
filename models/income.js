const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//  Pajamų modelis

class Income extends Model {}

Income.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE,
  },
  { sequelize, modelName: "income" }
);

module.exports = Income;

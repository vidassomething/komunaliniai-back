const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Išlaidų modelis

class Expense extends Model {}

Expense.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    amount: DataTypes.FLOAT,
    category: DataTypes.STRING,
    details: DataTypes.JSON,
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    type: {
      type: DataTypes.ENUM,
      values: ["expense", "income"],
      defaultValue: "expense",
    },
  },
  { sequelize, modelName: "expense" }
);

module.exports = Expense;

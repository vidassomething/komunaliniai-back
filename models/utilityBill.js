// Komunaklinės sąskaitos modelis
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class UtilityBill extends Model {}

UtilityBill.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE,
  },
  { sequelize, modelName: "utilityBill" }
);

module.exports = UtilityBill;

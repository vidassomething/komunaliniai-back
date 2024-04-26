const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//  Paslaugų modelis

class Utility extends Model {}

Utility.init(
  {
    name: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  { sequelize, modelName: "utility" }
);

module.exports = Utility;

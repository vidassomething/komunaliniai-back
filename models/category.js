const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Kategorijos modelis
class Category extends Model {}

Category.init(
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
  { sequelize, modelName: "category" }
);

module.exports = Category;

const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");

module.exports = router;

// Gauti visas kategorijas  pagal vartotojo id
const defaultCategory = [
  {
    id: 0,
    name: "Jokia",
    createdAt: "2024-04-19T22:13:40.031Z",
    updatedAt: "2024-04-19T22:13:40.031Z",
  },
];

router.get("/categories", authMiddleware(), async (req, res) => {
  const userId = req.user;
  try {
    const categories = await Category.findAll({ where: { userId } });
    res.json({ categories: [...categories, ...defaultCategory] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/category/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  try {
    const category = await Category.findOne({ where: { id, userId } });
    if (category) {
      await category.destroy();
      res.json({ message: "Category deleted" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/category", authMiddleware(), async (req, res) => {
  const { name } = req.body;
  const userId = req.user;
  try {
    const category = await Category.create({ name, userId });
    res.json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/categories", authMiddleware(), async (req, res) => {
  const { categories } = req.body;

  const userId = req.user;
  try {
    await Category.destroy({ where: { userId } });
    const createdcategories = await Promise.all(
      categories.map(async (category) => {
        return await Category.create({ name: category, userId });
      })
    );
    res.json({ categories: createdcategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

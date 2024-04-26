const express = require("express");
const router = express.Router();
const Income = require("../models/income");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");


router.post("/income", authMiddleware(), async (req, res) => {
  const { userId, amount, date } = req.body;
  try {
    const income = await Income.create({ userId, amount, date });
    res.json({ income });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/income/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  const { userId, amount, date } = req.body;
  try {
    const income = await Income.findOne({ where: { id } });
    if (income) {
      await income.update({ userId, amount, date });
      res.json({ income });
    } else {
      res.status(404).json({ message: "Income not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/income/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  try {
    const income = await Income.findOne({ where: { id } });
    if (income) {
      await income.destroy();
      res.json({ message: "Income deleted" });
    } else {
      res.status(404).json({ message: "Income not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get(
  "/incomes/:startDate/:endDate",
  authMiddleware(),
  async (req, res) => {
    const { startDate, endDate } = req.params;
    try {
      const incomes = await Income.findAll({
        where: {
          userId: userId,
          date: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
      });
      const totalIncome = incomes.reduce(
        (total, income) => total + income.amount,
        0
      );
      res.json({ incomes, totalIncome });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

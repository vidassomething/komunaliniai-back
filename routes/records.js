const express = require("express");
const router = express.Router();
const Income = require("../models/income");
const Expense = require("../models/expense");
const UtilityBill = require("../models/utilityBill");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");

// sort ?sortBy=date or ?sortBy=amount
router.get("/records", authMiddleware(), async (req, res) => {
  try {
    const { sortBy } = req.query;
    let expenses = await Expense.findAll({});
    let incomes = await Income.findAll({});
    let utilityBills = await UtilityBill.findAll({});

    let records = [...expenses, ...incomes, ...utilityBills];

    if (sortBy === "date") {
      records.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "amount") {
      records.sort((a, b) => a.amount - b.amount);
    }

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

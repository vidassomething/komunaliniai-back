const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

const authMiddleware = require("../middleware/auth");

router.get(
  "/totalAmountByCategory/:year",
  authMiddleware(),
  async (req, res) => {
    const { year } = req.params;
    const userId = req.user;
    try {
      const expenses = await Expense.findAll({
        where: {
          userId: userId,
          date: {
            [Op.between]: [
              new Date(`${year}-01-01`),
              new Date(`${year}-12-31`),
            ],
          },
        },
        attributes: [
          "category",
          [Sequelize.fn("sum", Sequelize.col("amount")), "totalAmount"],
        ],
        group: ["category"],
      });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/expensesReport/", authMiddleware(), async (req, res) => {
  const { startDate, endDate } = req.query;
  const userId = req.user;
  try {
    const expenses = await Expense.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    const totalExpense = expenses
      .filter((expense) => expense.type === "expense")
      .reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = expenses
      .filter((expense) => expense.type === "income")
      .reduce((sum, expense) => sum + expense.amount, 0);
    const total = totalIncome - totalExpense;
    res.json({ expenses, totalExpense, totalIncome, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/comparisonReport/:year", authMiddleware(), async (req, res) => {
  const { year } = req.params;
  const userId = req.user;
  try {
    const utilitiies = await Expense.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
        },
        category: "Komunaliniai",
      },
    });
    const expenses = await Expense.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
        },
        category: {
          [Op.not]: "Komunaliniai",
        },
      },
    });

    const utilityMonthlyTotals = {};
    for (let month = 0; month < 12; month++) {
      utilityMonthlyTotals[month] = 0;
    }
    utilitiies.forEach((expense) => {
      const month = expense.date.getMonth();
      const amount = expense.amount;
      utilityMonthlyTotals[month] += amount;
    });

    const expensesMonthlyTotals = {};
    for (let month = 0; month < 12; month++) {
      expensesMonthlyTotals[month] = 0;
    }
    expenses.forEach((expense) => {
      const month = expense.date.getMonth();
      const amount = expense.amount;
      expensesMonthlyTotals[month] += amount;
    });

    res.json({
      expensesMonthlyTotals: Object.values(expensesMonthlyTotals),
      utilityMonthlyTotals: Object.values(utilityMonthlyTotals),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/monthlyUtilities/:year", authMiddleware(), async (req, res) => {
  const { year } = req.params;
  const userId = req.user;
  try {
    const expenses = await Expense.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
        },
        category: "Komunaliniai",
      },
    });
    const monthlyTotals = {};
    for (let month = 0; month < 12; month++) {
      monthlyTotals[month] = 0;
    }
    expenses.forEach((expense) => {
      const month = expense.date.getMonth();
      const amount = expense.amount;
      monthlyTotals[month] += amount;
    });
    res.json(monthlyTotals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/monthlyExpenses/:year", authMiddleware(), async (req, res) => {
  const { year } = req.params;
  const userId = req.user;
  try {
    const expenses = await Expense.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
        },
        type: "expense", // Add this condition to filter expenses by type
      },
    });
    const monthlyTotals = {};
    for (let month = 0; month < 12; month++) {
      monthlyTotals[month] = 0;
    }
    expenses.forEach((expense) => {
      const month = expense.date.getMonth();
      const amount = expense.amount;
      monthlyTotals[month] += amount;
    });
    res.json(monthlyTotals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/monthlyIncome/:year", authMiddleware(), async (req, res) => {
  const { year } = req.params;
  const userId = req.user;
  try {
    const expenses = await Expense.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
        },
        type: "income", 
      },
    });
    const monthlyTotals = {};
    for (let month = 0; month < 12; month++) {
      monthlyTotals[month] = 0;
    }
    expenses.forEach((expense) => {
      const month = expense.date.getMonth();
      const amount = expense.amount;
      monthlyTotals[month] += amount;
    });
    res.json(monthlyTotals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

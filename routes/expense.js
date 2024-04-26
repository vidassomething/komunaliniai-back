const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");
const multer = require("multer"); 
const xlsx = require("xlsx"); 
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });


router.get("/expense/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  try {
    const expense = await Expense.findOne({ where: { id, userId } });
    if (expense) {
      res.json({ expense });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/expense", authMiddleware(), async (req, res) => {
  const { amount, category, date, name, type, details } = req.body;
  const userId = req.user;
  try {
    const expense = await Expense.create({
      userId,
      amount,
      category,
      date,
      name,
      type,
      details,
    });
    res.json({ expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/expense/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  const { amount, category, date, name } = req.body;
  try {
    const expense = await Expense.findOne({ where: { id } });
    if (expense) {
      await expense.update({ name, amount, category, date });
      res.json({ expense });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/expense/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findOne({ where: { id } });
    if (expense) {
      await expense.destroy();
      res.json({ message: "Expense deleted" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/expenses/", authMiddleware(), async (req, res) => {
  const { startDate, endDate } = req.query;
  const userId = req.user;
  console.log()
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)
  console.log(userId)

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

router.post(
  "/import",
  authMiddleware(),
  upload.single("file"),
  async (req, res) => {
    if (req.file && !req.file.originalname.endsWith('.xlsx')) {
      return res.status(400).send("No file uploaded.");
    }
    const workbook = xlsx.readFile(req.file.path, { cellDates: true });
    const sheetName = workbook.SheetNames[0]; // Assuming only one sheet
    const sheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const userId = req.user;
    try {
      
      const expenses = await Promise.all(
        jsonData.map(async (data) => {
          const { amount, category, date, name, type } = data;
          const expense = await Expense.create({
            userId,
            amount,
            category,
            date,
            name,
            type,
            details: {},
          });
          return expense;
        })
      );
      res.json({ expenses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/expenses/failas", authMiddleware(), async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user } });
    const jsonData = JSON.parse(JSON.stringify(expenses));
    const cleanedData = jsonData.map(({ createdAt, updatedAt, id, userId, details, ...rest }) => rest);
    const worksheet = xlsx.utils.json_to_sheet(cleanedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Expenses");
    const filePath = path.join(__dirname, "islaidos.xlsx");


    xlsx.writeFile(workbook, filePath);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=islaidos.xlsx"
    );
    res.sendFile(filePath, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;

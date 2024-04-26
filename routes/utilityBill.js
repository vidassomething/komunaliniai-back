const express = require("express");
const router = express.Router();
const UtilityBill = require("../models/utilityBill");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");

router.post("/utilityBill", authMiddleware(), async (req, res) => {
  const { name, amount, date } = req.body;
  try {
    const utilityBill = await UtilityBill.create({ name, amount, date });
    res.json({ utilityBill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/utilityBill", authMiddleware(), async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const utilityBills = await UtilityBill.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    const totalBillAmount = utilityBills.reduce(
      (total, bill) => total + bill.billAmount,
      0
    );
    res.json({ utilityBills, totalBillAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/utilityBill/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  const { name, billAmount } = req.body;
  try {
    const utilityBill = await UtilityBill.findOne({ where: { id } });
    if (utilityBill) {
      await utilityBill.update({ name, billAmount });
      res.json({ utilityBill });
    } else {
      res.status(404).json({ message: "Utility bill not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/utilityBill/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  try {
    const utilityBill = await UtilityBill.findOne({ where: { id } });
    if (utilityBill) {
      await utilityBill.destroy();
      res.json({ message: "Utility bill deleted" });
    } else {
      res.status(404).json({ message: "Utility bill not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

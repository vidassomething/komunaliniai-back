const express = require("express");
const router = express.Router();
const Utility = require("../models/utility");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");

module.exports = router;

const defaultUtility = {
  id: 0,
  name: "trash",
  createdAt: "2024-04-19T22:13:40.031Z",
  updatedAt: "2024-04-19T22:13:40.031Z",
};

router.get("/utilities", authMiddleware(), async (req, res) => {
  const userId = req.user;
  try {
    const utilities = await Utility.findAll({ where: { userId } });
    res.json({ utilities: [...utilities, defaultUtility] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/utility/:id", authMiddleware(), async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  try {
    const utility = await Utility.findOne({ where: { id, userId } });
    if (utility) {
      await utility.destroy();
      res.json({ message: "utility deleted" });
    } else {
      res.status(404).json({ message: "utility not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/utility", authMiddleware(), async (req, res) => {
  const { name } = req.body;
  const userId = req.user;
  try {
    const utility = await Utility.create({ name, userId });
    res.json({ utility });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/utilities", authMiddleware(), async (req, res) => {
  const { utilities } = req.body;

  const userId = req.user;
  try {
    await Utility.destroy({ where: { userId } });

    const createdUtilities = await Promise.all(
      utilities.map(async (utility) => {
        return await Utility.create({ name: utility, userId });
      })
    );

    res.json({ utilities: createdUtilities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

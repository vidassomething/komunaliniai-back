const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const secretKey = "mysecretkey";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testavimas1899@gmail.com",
    pass: "f444f@ffg5AA4dfdf",
  },
});


router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('naujas slaptazodis: ' + newPassword)
    user.password = hashedPassword;
    await user.save();

 
    const mailOptions = {
      from: "testavimas1899@gmail.com",
      to: email,
      subject: "Slaptažodis atkurtas",
      text: `Jūsų naujas laikinas slaptažodis ${newPassword}`,
    };

    await transporter.sendMail(mailOptions);
  
    res.status(200).json({ message: "Naujas slaptažodis išsiųstas" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Serverio klaida" });
  }
});


router.get("/profile", authMiddleware(), async (req, res) => {
  try {
    User.findByPk(req.user, {
      attributes: { exclude: ["password"] },
    })
      .then((user) => {
        if (user) {
          res.json(user.toJSON());
        } else {
          res.json(user);
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Error occurred:", err);
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, {
      expiresIn: "24h",
    });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/profile", authMiddleware(), async (req, res) => {
  const { name, email, location, picture } = req.body;

  try {
    let user = await User.findByPk(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.picture = picture || user.picture;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, userType, location, picture } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      location,
      userType,
      picture,
    });

    await user.save();

    const mailOptions = {
      from: "testavimas1899@gmail.com",
      to: email,
      subject: "Sveikiname prisiregistravus!",
      text: `Sveikiname prisiregistravus! Tikimės jums patiks NŪKMAIS`,
    };

    // await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

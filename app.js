const express = require("express");
const sequelize = require("./config/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const user = require("./routes/user");
const expense = require("./routes/expense");
const utility = require("./routes/utility");
const records = require("./routes/records");
const category = require("./routes/category");
const reports = require("./routes/reports");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", user);
app.use("/api", expense);
app.use("/api", utility);
app.use("/api", records);
app.use("/api", category);
app.use("/api", records);
app.use("/api", reports);

sequelize.sync().then(() => {
  app.listen(9000, () => {
    console.log("Serveris klauso porto 9000");
  });
});

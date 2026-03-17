const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://zgm5057_db_user:VNHStLAENikdbuim@foodproducts.ukcgr3l.mongodb.net/?appName=FoodProducts")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("SmartBite API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
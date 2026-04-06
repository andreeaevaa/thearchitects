const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
// 1. Import the Observer Subject
const scannerSubject = require("./observer"); 

const app = express();

app.use(cors());
app.use(express.json());


scannerSubject.subscribe((product) => {
  console.log(`\n[OBSERVER PATTERN]: Event Detected!`);
  console.log(`User is viewing: ${product.productName}`);
  console.log(`Health Score: ${product.healthScore}/100`);
  console.log(`------------------------------------\n`);
});

app.set("scannerSubject", scannerSubject);

mongoose.connect("mongodb+srv://zgm5057_db_user:VNHStLAENikdbuim@foodproducts.ukcgr3l.mongodb.net/SmartBite")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SmartBite API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/products", async (req, res) => {
  const products = await Product.find();
  console.log(`Fetched ${products.length} products from database`);
  res.json(products);
});

router.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
  console.log("Fetched product:", product.productName);
});

router.get("/products/barcode/:barcode", async (req, res) => {
  const product = await Product.findOne({ barcode: req.params.barcode });
  res.json(product);
  console.log("Fetched product:", product.productName);
});

router.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.json(savedProduct);
});

module.exports = router;
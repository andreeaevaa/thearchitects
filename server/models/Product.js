const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  barcode: String,
  image: String,
  ingredients: [String],
  servingSize: String,
  nutrition: {
    calories: Number,
    fat: Number,
    saturatedFat: Number,
    sodium: Number,
    carbs: Number,
    sugar: Number,
    protein: Number
  },
  healthScore: Number
});

module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    displayName: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    age: { type: Number, default: null },
    weight: { type: Number, default: null },       
    height: { type: Number, default: null },       
    goal: { type: String, default: "maintain" },   
    activityLevel: { type: String, default: "moderate" }, 
    dailyCalorieTarget: { type: Number, default: null },
    dietaryRestrictions: { type: [String], default: [] }, 
    preferLowSodium: { type: Boolean, default: false },
    preferLowSugar: { type: Boolean, default: false },
    preferHighProtein: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
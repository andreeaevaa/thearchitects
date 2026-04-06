const mongoose = require("mongoose");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance; // Return existing instance
    }
    this.connection = null;
    Database.instance = this;
  }

  async connect(uri) {
    if (this.connection) {
      console.log("Using existing DB connection");
      return this.connection;
    }
    this.connection = await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    return this.connection;
  }
}

module.exports = new Database(); // Export a single instance
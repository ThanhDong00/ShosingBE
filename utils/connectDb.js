const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed");
    process.exit(1);
  }
};

module.exports = connectDb;

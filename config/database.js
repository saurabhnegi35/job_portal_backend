const mongoose = require("mongoose");

module.exports = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Connected to MongoDB successfully!");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  } catch (error) {
    console.log(error);
  }
};

const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to database");
  } catch (err) {
    console.log("cannot connect to database: ", err);
  }
};

module.exports = connectToDB;

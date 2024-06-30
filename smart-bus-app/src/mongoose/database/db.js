// db.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const configs = require("../../../config/config.json");
const utility = require("../../utility");

const { mongoURL } = configs;
const logFilePath="db.log";
//  = path.join(__dirname, "logs", "db.log");

mongoose.set("debug", true);

async function connect() {
  try {
    // { useNewUrlParser: true, useUnifiedTopology: true }

    mongoose
      .connect(mongoURL)
      .then(() => {
        console.log("Connected to MongoDB");
        utility.logToFile("Connected to MongoDB", logFilePath);
      })
      .catch((err) => {
        console.log("Issue with Connecting MongoDB :", err);
        utility.logToFile(`Issue with Connecting MongoDB: ${err}`, logFilePath);

      });

    // await mongoose.connect(mongoURL);
    // console.log("Connected to MongoDB");

    
  } catch (err) {
    console.error("Issue with Connecting MongoDB:", err);
    utility.logToFile(`Issue with Connecting MongoDB: ${err}`, logFilePath);
  }
}

module.exports = {
  connect,
};

const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  plateno: { type: String, required: true },
  carName: { type: String, required: true },
  carModel: { type: String, required: true },
  engineType: { type: String, required: true },
  receivedDate: { type: String, required: true },
  Sorting: { type: Date, required: true, default: Date.now },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;

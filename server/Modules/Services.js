const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  issuerName: {
    type: String,
    required: true,
  },
  services: {
    type: [serviceSchema],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  issuedDate: {
    type: Date,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["Visa", "Cash", "Transfer", "Cash + Visa", "Cash + Transfer"],
    required: true,
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;

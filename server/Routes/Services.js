const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Create a schema for the payment data
const paymentSchema = new mongoose.Schema({
  issuedBy: {
    type: String,
    required: true,
  },
  description: [
    {
      items: {
        type: String,
        required: true,
      },
      unitCost: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  issuedDate: {
    type: String,
    required: true,
  },
  carId: {
    type: String,
    required: true,
  },
});

// Create a model based on the schema
const Payment = mongoose.model("Payment", paymentSchema);

// Define the route to insert a payment
router.post("/payments", async (req, res) => {
  try {
    // Create a new payment document
    const payment = new Payment(req.body);

    // Save the payment to the database
    await payment.save();

    res.status(200).json({ message: "Payment saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save payment" });
  }
});

// Define a route to fetch the services of cars for a specific invoice
router.get("/Seeinvoice/:id/invoices", (req, res) => {
  const carId = req.params.id;

  Payment.find({ carId })
    .then((invoices) => {
      if (invoices[0] === undefined) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Get the invoices of a specific car from the payment document
      res.status(200).json(invoices);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch invoices" });
    });
});

// Define a route to fetch all the services of cars from specific start and end date
router.get("/Seeinvoice/Allinvoices", (req, res) => {
  Payment.find({})
    .then((invoices) => {
      if (invoices[0] === undefined) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Get the invoices of a specific car from the payment document
      res.status(200).json(invoices);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch invoices" });
    });
});

module.exports = router;

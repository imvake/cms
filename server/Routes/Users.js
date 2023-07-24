const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Create a schema for the registration data
const registrationSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  cars: [
    {
      plateNo: String,
      carName: String,
      carModel: String,
      engineType: String,
      receivedDate: Date,
    },
  ],
});

// Create a model based on the schema
const Registration = mongoose.model("Registration", registrationSchema);

// Define the registration route
router.post("/Users", (req, res) => {
  // Extract name and phoneNumber from the request body
  const { name, phoneNumber } = req.body;

  // Check if the phone number already exists
  Registration.findOne({ phoneNumber })
    .then((existingRegistration) => {
      if (existingRegistration) {
        return res.status(400).send("Phone number already exists");
      }

      // Create a new registration document
      const registration = new Registration({
        name,
        phoneNumber,
      });

      // Save the registration to the database
      registration
        .save()
        .then(() => {
          return res.status(200).send("Registration saved successfully");
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).send("Failed to save registration");
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send("Failed to check phone number");
    });
});

// Define a route to fetch all registrations
router.get("/registrations", (req, res) => {
  Registration.find()
    .sort({ _id: -1 }) // Sort by the _id field in descending order (newest to oldest)
    .then((registrations) => {
      res.status(200).json(registrations);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to fetch registrations");
    });
});

// Define the delete route
router.delete("/delete/:id", async (req, res) => {
  const registrationId = req.params.id;

  try {
    // Find the registration by ID and remove it from the database
    const deletedRegistration = await Registration.findByIdAndRemove(
      registrationId
    );

    if (!deletedRegistration) {
      return res.status(404).send("Registration not found");
    }

    return res.status(200).send("Registration deleted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to delete registration");
  }
});

// Define the route to add a car for a registration
router.post("/Seecars/:id", async (req, res) => {
  const registrationId = req.params.id;
  const { plateNo, carName, carModel, engineType, receivedDate } = req.body;

  try {
    // Find the registration by ID
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).send("Registration not found");
    }

    // Add the new car to the cars array
    registration.cars.push({
      plateNo,
      carName,
      carModel,
      engineType,
      receivedDate,
    });

    // Save the updated registration
    await registration.save();

    return res.status(200).send("Car added successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to add car");
  }
});

// Define the check phone number route
router.get("/checkPhoneNumber/:phoneNumber", (req, res) => {
  const phoneNumber = req.params.phoneNumber;

  Registration.findOne({ phoneNumber })
    .then((existingRegistration) => {
      const exists = !!existingRegistration;
      res.status(200).json({ exists });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send("Failed to check phone number");
    });
});

// Define a route to fetch the cars for a specific registration
router.get("/Seecars/:id/cars", (req, res) => {
  const registrationId = req.params.id;

  Registration.findById(registrationId)
    .then((registration) => {
      if (!registration) {
        return res.status(404).send("Registration not found");
      }

      // Get the cars array from the registration document
      const cars = registration.cars;

      res.status(200).json(cars);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to fetch cars");
    });
});

// Define a route to fetch all the services of cars from specific start and end date
router.get("/Seecars/Allcars", (req, res) => {
  Registration.find({})
    .then((cars) => {
      if (cars[0] === undefined) {
        return res.status(404).json({ message: "cars not found" });
      }

      // Get the cars of a specific car from the payment document
      res.status(200).json(cars);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch cars" });
    });
});

router.delete("/Seecars/:id/:carId", async (req, res) => {
  const registrationId = req.params.id;
  const carId = req.params.carId;

  try {
    // Find the registration by ID
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).send("Registration not found");
    }

    // Find the car by ID in the cars array
    const carIndex = registration.cars.findIndex(
      (car) => car._id.toString() === carId
    );

    if (carIndex === -1) {
      return res.status(404).send("Car not found");
    }

    // Remove the car from the cars array
    registration.cars.splice(carIndex, 1);

    // Save the updated registration
    await registration.save();

    return res.status(200).send("Car deleted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to delete car");
  }
});

module.exports = router;

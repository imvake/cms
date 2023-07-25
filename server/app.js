const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Login = require("./Modules/Login.js");
// const Carinsert = require("./Carinsert");
const username = require("./Routes/username.js");
const crypto = require("crypto");
// const Addservice = require("./Addservice");
// const invoice = require("./Invoice.js");
const Users = require("./Routes/Users.js");
const Services = require("./Routes/Services.js");

const secretKey = crypto.randomBytes(32).toString("hex");

const app = express();
app.use(cors(
  {
    origin: "https://deploy-cms-pjv1qzd5g-imvake.vercel.app",
    credentials: true
  }
));
app.use(express.json());

const connectionString =
  "mongodb+srv://cardb:cardb@db.onyxpsg.mongodb.net/cardb";
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: connectionString,
      collectionName: "sessions",
    }),
  })
);

// ******** For Login ******** //

// Middleware function to check authentication state
const isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    // User is authenticated, allow access to the requested route
    next();
  } else {
    // User is not authenticated, redirect to the login page or return an error
    res.redirect("/login"); // Redirect to the login page
    // or
    res.status(401).json({ error: "Unauthorized" }); // Return an error response
  }
};

app.get("/protected-route", isAuthenticated, (req, res) => {
  // Handle the protected route logic
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Login.findOne({ username, password }).exec();

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set the loggedIn flag in the session
    req.session.loggedIn = true;

    // Send a success message or status code
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  to insert cars
// app.use("/cars", Carinsert);

//  to get the username
app.use("/username", username);

// to add the services into the db
// app.use("/Addservice", Addservice);
// to add the services into the db
// app.use("/inv", invoice);

// to insert the Phone & uname into the db
app.use("/register", Users);

// to insert the Services into the db
app.use("/Services", Services);

app.listen(3001, () => {
  console.log("Server is running...");
});

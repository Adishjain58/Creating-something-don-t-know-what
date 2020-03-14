const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Routes
const userRoutes = require("./routes/user");

// Init app
const app = express();

// Extracting database url
const db = require("./config/key").mongoURI;

// Connecting to database.
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(() => {
    console.log("Something went wrong");
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("test", { msg: "" });
});

// To use the created routes
app.use(userRoutes);
const port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
  console.log("App started on port " + port);
});

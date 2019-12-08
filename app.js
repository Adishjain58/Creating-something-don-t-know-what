const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const {
  registerValidation,
  loginValidation
} = require("./Validations/uservalidation");
const User = require("./models/User");
// To upload the file
const upload = require("./multer/multer");

// Function to delete the image and here value is the path of image that is going to be deleted.
const deleteFile = imagePath => {
  // Converting it acc. to windows.
  imagePath = imagePath.replace(/[/]/, "\\");
  // Retrieving current directory path
  let direct = __dirname;
  // changing to get the new path
  // direct = direct.substr(0, direct.length - 6);
  // Deleting the old file
  fs.unlinkSync(direct + "\\public\\" + imagePath);
};

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

// Route to register a user
// Note:- the callback after upload is to check for multer errors
app.post(
  "/register",
  upload,
  (err, req, res, next) => {
    if (err) {
      res.json({ error: err.message });
    }
  },
  registerValidation,
  (req, res) => {
    // Getting validation results
    const errors = validationResult(req);

    // If there are validation errors then sending messages from server
    if (!errors.isEmpty()) {
      // If reached at this point then file will be uploaded.So, deleting the uploaded file
      if (req.file) {
        deleteFile(`uploads/${req.file.filename}`);
      }
      return res.status(422).json({ errors: errors.array() });
    }

    if (!req.file) {
      res.json({ err: "File is required" });
    } else {
      const { name, email, dob, gender, password } = req.body;

      User.create({
        name,
        email,
        dob,
        gender,
        password,
        profileImage: `uploads/${req.file.filename}`
      })
        .then(user => {
          res.status(201).json(user);
        })
        .catch(() =>
          res.status(500).json({
            err: "User was not created try again"
          })
        );
    }
  }
);

app.post("/login", loginValidation, (req, res) => {
  // Getting validation results
  const errors = validationResult(req);

  // If there are validation errors then sending messagesfrom server
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
});

const port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
  console.log("App started on port " + port);
});

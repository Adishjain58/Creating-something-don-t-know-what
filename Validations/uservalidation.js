const { check } = require("express-validator");
const User = require("../models/User");

let d = new Date();
let year = d.getFullYear();
let month = d.getMonth();
let day = d.getDate();
let cA = new Date(year - 18, month, day).toDateString();
let cB = new Date(year - 65, month, day).toDateString();

const registerValidation = [
  check("name")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Name is required")
    .bail()
    .isAlpha()
    .withMessage("Name must contain only alphabetical characters")
    .isLength({ min: 4 })
    .withMessage("Name should be atleast 4 characters"),
  check("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("This is not a valid email")
    .bail()
    .custom(async val => {
      let user = await User.findOne({ email: val });
      if (user === null) {
        return true;
      } else {
        throw new Error("Email already exists");
      }
    }),
  check("dob")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Date of birth is required")
    .bail()
    .isBefore(cA)
    .withMessage("Age should be greater than 18")
    .bail()
    .isAfter(cB)
    .withMessage("Age should be less than 65"),
  check("password")
    .exists({ checkNull: true, checkFalsy: true })
    .bail()
    .withMessage("Password is required")
    .isAlphanumeric()
    .withMessage("Password should contain only numbers and characters")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password should contain atleast 8 character"),
  check("password2")
    .exists({ checkNull: true, checkFalsy: true })
    .bail()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  check("gender")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Gender is required"),
  check("number")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Mobile number  is required")
    .bail()
    .isNumeric()
    .withMessage("Only numeric digits are allowed")
    .bail()
    .matches(/[0-9]{10}/)
    .withMessage("Mobile number should contain exactly 10 digits")

  // .isAlpha()
  // .withMessage("Gender must contain only alphabetical characters")
];

const loginValidation = [
  check("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("This is not a valid email")
    .bail()
    .custom(async val => {
      let user = await User.findOne({ email: val });
      if (user === null) {
        throw new Error("Email does not exists");
      } else {
        return true;
      }
    }),
  check("password")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isAlphanumeric()
    .withMessage("Password should contain only numbers and characters")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password should contain atleast 8 character")
];

module.exports = {
  registerValidation,
  loginValidation
};

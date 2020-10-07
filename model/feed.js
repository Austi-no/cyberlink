const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt-nodejs"); // A native JS bcrypt library for NodeJS

const Schema = mongoose.Schema;

// Validate Function to check e-mail length
let bodyLengthChecker = (body) => {
  // Check if e-mail exists
  if (!body) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (body.length < 5 || body.length > 250) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Array of Email Validators
const bodyValidators = [
  // First Email Validator
  {
    validator: bodyLengthChecker,
    message: "Body must be more than 5 and no more than 250",
  },
];

// Validate Function to check username length
let commentLengthChecker = (comment) => {
  // Check if username exists
  if (!comment[0]) {
    return false; // Return error
  } else {
    // Check length of username string
    if (comment[0].length < 1 || comment[0].length > 35) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// Array of Username validators
const commentValidators = [
  // First Username validator
  {
    validator: commentLengthChecker,
    message: "Comment must be at least 1 characters but no more than 35",
  },
];

// User Model Definition
const feedsSchema = new Schema({
  body: { type: String, required: true, validate: bodyValidators },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: { type: Array },
  dislikes: { type: Number, default: 0 },
  dislikedBy: { type: Array },
  comments: [
    {
      comment: { type: String, validate: commentValidators },
      commentator: { type: String },
    },
  ],
});

module.exports = mongoose.model("Feeds", feedsSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the meals schema
const userSchema = new Schema({
  "firstName": String,
  "lastName": String,
  "email": {
    type: String,
    unique: true
  },
  "password": String,
  "createdOn": {
        type: Date,
        default: Date.now
  },
  "role": String
});

//module.exports = mongoose.model("users", userSchema);
module.exports = userSchema;
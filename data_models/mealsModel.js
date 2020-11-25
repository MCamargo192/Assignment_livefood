const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the meals schema
const mealsSchema = new Schema({
    "src": {
        "type": String,
        "unique": true
    },
    "title": String,
    "price": Number,
    "ingredients": String,
    "values": {
        "calories": Number,
        "protein": Number,
        "carbs": Number,
        "fat": Number
    },
    "category": String,
    "isTopPackage": Boolean,
    "createdOn": {
        type: Date,
        default: Date.now
    }
});

// define the meals schema
const packagesSchema = new Schema({
    "src": String,
    "title": String,
    "description": String,
    "synopsis": String,
    "price": Number,
    "numberMeals": Number,
    "isTopPackage": Boolean,
    "createdOn": {
        type: Date,
        default: Date.now
    }
});

//module.exports.meals = mongoose.model("meals", mealsSchema);
//module.exports.packages = mongoose.model("packages", packagesSchema);
module.exports = mongoose.model("packages", packagesSchema);
/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Marcelo Augusto Caixeta Camargo Student ID: 143739191 Date: October 23th, 2020.
*
* Online (Heroku, https://...) Link: https://livefood.herokuapp.com/
*
* GitHub or Bitbucket repo Link: https://github.com/MCamargo192/Assignment_livefood.git
*
********************************************************************************/

// Get the express module
const express = require("express");
const exphbs = require('express-handlebars');
const app = express();

// Register handlebars 
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

// Get the body-parser module
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define which PORT number will be used
var HTTP_PORT = process.env.PORT || 8080;

// Display the Port number used by the server
var onHttpStart = () => { console.log("Express http server listening on: " + HTTP_PORT); }

//Getting CSS and Images from public folder
app.use(express.static('public'));

//Route handlers
// Home page route
app.get("/", (req, res) => { res.render('home', { layout: 'main' }); });

// Packages page route
app.get("/packages", (req, res) => { res.render('packages', { layout: 'main' }); });

// Login page route
app.get("/login", (req, res) => { res.render('login', { layout: 'main' }); });

// Get Validation module
const valid = require("./validation");

app.post("/login", (req, res) => { valid.loginValid(req,res); });

// Register page route
app.get("/register", (req, res) => { res.render('register', { layout: 'main' }); });

app.post("/register", (req, res) => { valid.registerValid(req,res); });

app.use((req, res) => { res.render('404', { layout: false }); });

// Starts the server and show which Port are being used
app.listen(HTTP_PORT, onHttpStart);
/*****************************************************************************************************
* WEB322 – Assignment 03-05             
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Marcelo Augusto Caixeta Camargo Student ID: 143739191 Date: December 08th, 2020.
*
* Online (Heroku, https://...) Link: https://livefood.herokuapp.com/
*
* GitHub or Bitbucket repo Link: https://github.com/MCamargo192/Assignment_livefood.git
*
****************************************************************************************************/

// Get Libraries
const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require('path');
const multer = require("multer");
const clientSessions = require("client-sessions");
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose")
require('dotenv').config();

// Define connection string to database 
const connStr = process.env.MONGO_CONN_SRT;
// Get data from data-service.js
const data_service = require("./data-service");
const dataService = data_service(connStr);
// Get data from data-entry-clerk.js
const data_clerk = require("./data-entry-clerk");
const dataClerk = data_clerk(connStr);
// Get validation module
const valid = require("./validation");
// Get email generator module
const mail = require("./email-generator");

// Connect to mongoDB database
mongoose.connect(connStr, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
mongoose.connection.on("open", () => { console.log("Connected to LiveFood database.") });

// Register handlebars 
const app = express();
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set meals photos storage path
const PHOTODIRECTORY = "./public/img/";
//Getting CSS and Images from public folder
app.use(express.static("./public/"));
// Check if photo folder exists
if (!fs.existsSync(PHOTODIRECTORY))
    fs.mkdirSync(PHOTODIRECTORY);
// Set storage file name
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, PHOTODIRECTORY); },
    filename: (req, file, cb) => { cb(null, file.originalname); }
});
// Set upload function
const fileFilter = (req, file, cb) => {
    // Allowed Extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check Extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname)
        return cb(null, true);
    else
        cb(res.status(500).end());
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Define which PORT number will be used
var HTTP_PORT = process.env.PORT || 8080;

// Display the Port number used by the server
var onHttpStart = () => { console.log("Express http server listening on: " + HTTP_PORT); }

// Setup client-sessions
app.use(clientSessions({
    cookieName: "session",
    secret: "livefood_session",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

//Route handlers
// Home page route
app.get("/", (req, res) => {
    dataClerk.getTopPackages()
        .then(packages => { res.render("home", { data: packages, layout: (req.session.user ? 'users' : 'main') }); })
        .catch(err => { res.status(500).end(); });
});

// Packages page route
app.get("/packages", (req, res) => {
    dataClerk.getAllPackages()
        .then(packages => { res.render("packages", { data: packages, layout: (req.session.user ? 'users' : 'main') }); })
        .catch(err => { res.status(500).end(); });
});

// Login page route
app.get("/login", (req, res) => { res.render('login', { layout: 'main' }); });

app.post("/login", (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    let validation = valid.loginValid(req);
    if (validation.valid) { res.render('login', { emptyData: validation.empty, form: validation.form, layout: 'main' }) }
    else {
        dataService.getUserByEmail(req.body)
            .then(resultUser => {
                bcrypt.compare(userPassword, resultUser[0].password)
                    .then((result) => {
                        if (userEmail === resultUser[0].email && result) {
                            req.session.user = {
                                fname: resultUser[0].firstName,
                                lname: resultUser[0].lastName,
                                password: resultUser[0].password,
                                email: resultUser[0].email,
                                role: resultUser[0].role,
                                newUser: false
                            };

                            if (req.session.user.role == "User")
                                req.session.user.cart = { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 }

                            res.redirect('dashboard');
                        }
                        else
                            res.render(res.render('login', { invalidLogin: "Sorry, you entered the wrong email and/or password.", form: validation.form, layout: 'main' }));
                    });
            })
            .catch(err => { res.render('login', { invalidLogin: "Sorry, no user was found for this email.", form: validation.form, layout: 'main' }); });
    }
});

// Register page route
app.get("/register", (req, res) => { res.render('register', { layout: 'main' }); });

app.post("/register", (req, res) => {
    let validation = valid.registerValid(req);
    if (validation.valid)
        res.render('register', { emptyData: validation.empty, form: validation.form, layout: 'main' });
    else {
        const userMetaData = req.body;

        dataService.addUser(userMetaData)
            .then(() => {
                let mailer = mail.mailSender(req);
                // Send registration email and load dashboard.
                mailer.transp.sendMail(mailer.mailOption).then(() => {
                    req.session.user = {
                        fname: userMetaData.firstName,
                        lname: userMetaData.lastName,
                        password: userMetaData.password,
                        email: userMetaData.email,
                        role: 'User',
                        newUser: true
                    };

                    if (req.session.user.role == "User")
                        req.session.user.cart = { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 }

                    res.redirect('dashboard');
                }).catch(err => console.log(err));
            })
            .catch(err => {
                res.render('register', { registeredUser: "Sorry, there is an account for this email.", form: validation.form, layout: 'main' });
            })
    }
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect('login');
});

const ensureLogin = (req, res, next) => {
    if (!req.session.user)
        res.redirect("/login");
    else
        next();
}
app.get("/dashboard", ensureLogin, (req, res) => {
    if (req.session.user.role === "User")
        res.render("user-dashboard", { user: req.session.user, layout: 'users' });
    else {
        dataClerk.getAllPackages()
            .then(packages => { res.render("clerk-dashboard", { data: packages, user: req.session.user, layout: 'users' }); })
            .catch(err => { res.status(500).end(); });
    }
});

// Add Package form
app.get("/add-package", ensureLogin, (req, res) => { res.render("add-packages", { layout: 'users' }); });

app.post("/add-package", upload.single("src"), (req, res) => {
    const package = {
        src: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        synopsis: req.body.synopsis,
        price: req.body.price,
        numberMeals: req.body.numberMeals,
        isTopPackage: req.body.isTopPackage
    };

    dataClerk.addPackage(package)
        .then(() => { res.redirect('dashboard'); })
        .catch(err => { res.status(500).end(); });
});

// Update Package form
app.get("/update-package/:_id", ensureLogin, (req, res) => {
    const id = req.params._id;
    dataClerk.getPackageById(id)
        .then(package => {
            let pack = {
                _id: package[0]._id,
                src: package[0].src,
                title: package[0].title,
                description: package[0].description,
                synopsis: package[0].synopsis,
                price: package[0].price,
                numberMeals: package[0].numberMeals,
                isTopPackage: package[0].isTopPackage
            }
            let file = pack.src;
            res.render("update-packages", { item: pack, filename: file, layout: 'users' });
        })
        .catch(err => { res.status(500).end(); });
});

app.post("/update-package/:_id&:filename", upload.single("src"), (req, res) => {
    const id = req.params._id;
    const file = req.params.filename
    const package = {
        title: req.body.title,
        description: req.body.description,
        synopsis: req.body.synopsis,
        price: req.body.price,
        numberMeals: req.body.numberMeals,
        isTopPackage: req.body.isTopPackage
    }
    req.file ? package.src = req.file.filename : package.src = req.params.filename;
    if (req.file != undefined) {
        fs.unlink(PHOTODIRECTORY + file, (err) => {
            err ? console.log(err) : console.log("Removed file : " + file);
        });
    }

    dataClerk.updatePackage(id, package)
        .then(() => {
            console.log("User " + id + " was updated");
            res.redirect('/dashboard');
        })
        .catch(err => {
            console.log("User " + id + " was not updated");
            res.redirect('/dashboard');
        });
});

// Remove Package route
app.post("/remove-package/:id&:filename", (req, res) => {
    const id = req.params.id;
    const file = req.params.filename;

    dataClerk.deletePackage(id)
        .then(() => {
            fs.unlink(PHOTODIRECTORY + file, (err) => {
                err ? console.log(err) : console.log("Removed file : " + file);
            });

            console.log("User " + id + " was removed");
            res.redirect('/dashboard');

        })
        .catch(err => {
            console.log("User " + id + " was not removed");
            res.redirect('/dashboard');
        });
});

// User Cart view
app.get("/cart", ensureLogin, (req, res) => { res.render("cart", { user: req.session.user, layout: 'users' }); });

app.post("/add-to-cart", ensureLogin, (req, res) => {
    let newItem = req.body
    let found = false;
    // Check if the item is already in the cart
    req.session.user.cart.items.forEach(item => {
        if (item.id === newItem.id) {
            // If item is in the cart, update the quantity
            item.quantity = parseInt(item.quantity) + parseInt(newItem.quantity);
            found = true;
        }
    })
    // If not add to it
    if (!found)
        req.session.user.cart.items.push(newItem);

    req.session.user.cart.subtotal = 0;
    req.session.user.cart.tax = 0;
    req.session.user.cart.shipping = 0;
    req.session.user.cart.total = 0;

    req.session.user.cart.items.forEach(item => {
        req.session.user.cart.subtotal = (parseFloat(req.session.user.cart.subtotal) + (parseFloat(item.price) * parseInt(item.quantity))).toFixed(2);
    })
    req.session.user.cart.tax = (parseFloat(req.session.user.cart.subtotal) * 0.13).toFixed(2);
    req.session.user.cart.shipping = (parseFloat(req.session.user.cart.subtotal) * 0.05).toFixed(2);
    req.session.user.cart.total = (parseFloat(req.session.user.cart.subtotal) + parseFloat(req.session.user.cart.tax) + parseFloat(req.session.user.cart.shipping)).toFixed(2);

    res.redirect('/cart');
});

app.get("/remove-from-cart/:id", ensureLogin, (req, res) => {
    let id = req.params.id;

    for (let i = 0; i < req.session.user.cart.items.length; i++) {
        if (req.session.user.cart.items[i].id === id)
            req.session.user.cart.items.splice(i, 1);
    }
    // Recalculate total of the cart
    req.session.user.cart.subtotal = 0;
    req.session.user.cart.tax = 0;
    req.session.user.cart.shipping = 0;
    req.session.user.cart.total = 0;

    if (req.session.user.cart.items.length > 0) {
        req.session.user.cart.items.forEach(item => {
            req.session.user.cart.subtotal = (parseFloat(req.session.user.cart.subtotal) + (parseFloat(item.price) * parseInt(item.quantity))).toFixed(2);
        })
        req.session.user.cart.tax = (parseFloat(req.session.user.cart.subtotal) * 0.13).toFixed(2);
        req.session.user.cart.shipping = (parseFloat(req.session.user.cart.subtotal) * 0.05).toFixed(2);
        req.session.user.cart.total = (parseFloat(req.session.user.cart.subtotal) + parseFloat(req.session.user.cart.tax) + parseFloat(req.session.user.cart.shipping)).toFixed(2);

        res.redirect('/cart');
    }
    else
        res.redirect('/dashboard');
});

app.post("/checkout", ensureLogin, (req, res) => {
    let shippingInfo = {
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        email: req.session.user.email,
        items: req.session.user.cart.items,
        subtotal: req.session.user.cart.subtotal,
        tax: req.session.user.cart.tax,
        shipping: req.session.user.cart.shipping,
        total: req.session.user.cart.total,
        address: req.body.address,
        apartment: req.body.apartment,
        city: req.body.city,
        province: req.body.province,
        postalcode: req.body.postalcode,
        instructions: req.body.instructions
    }
    let mailer = mail.checkoutMail(shippingInfo);
    // Send registration email and load dashboard.
    mailer.transp.sendMail(mailer.mailOption)
        .then(() => {
            req.session.user.cart = { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 };
            let order = true;
            res.render("user-dashboard", { user: req.session.user, shipping: order, layout: 'users' });
        })
        .catch(err => console.log(err));
});

app.use((req, res) => { res.render('404', { layout: false }); });

// Starts the server and show which Port are being used
dataService.connect()
    .then(() => { app.listen(HTTP_PORT, onHttpStart); })
    .catch(err => {
        console.log("Unable to start the server: ", err.message);
        process.exit();
    });

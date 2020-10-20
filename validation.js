// Login validation
module.exports.loginValid = (req, res) => {
    // Holder values
    var loginForm = req.body;

    //Validation
    var emptyData = {
        email: "",
        password: ""
    };
    if (!loginForm.email) emptyData.email = { msg: "Enter your email!" };
    if (!loginForm.password) emptyData.password = { msg: "Enter your password!" };

    var validationErrors = emptyData.email || emptyData.password
    return validationErrors ? res.render('login', { emptyData: emptyData, form: loginForm, layout: 'main' }) : false;
};
//Register Validation
module.exports.registerValid = (req, res) => {
    // Set mailsender module
    const nodemailer = require('nodemailer');
    const mailGen = require('mailgen');

    const EMAIL = "livefit.web322@gmail.com";
    const PASSWORD = "livefit2020";
    const MAIN_URL = "http://localhost:8080/";

    var transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        port: 465,
        secure: true,
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    var mailGenerator = new mailGen({
        theme: "default",
        product: {
            name: "LiveFit",
            link: MAIN_URL
        }
    });

    // Holder values
    var registerForm = req.body;

    //Validation
    var emptyData = {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    };

    var emailValidation = email => {
        const emailFilter = /^([a-z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailFilter.test(email)
    }

    var passwordValidation = password => {
        const passwordFilter = /^((?=.*[a-z])|(?=.*[A-Z]))(?=.*\d)[a-zA-Z\d]{6,12}$/;
        return passwordFilter.test(password);
    }

    if (!registerForm.firstName) emptyData.firstName = { msg: "Enter a valid name!" };
    if (!registerForm.lastName) emptyData.lastName = { msg: "Enter a valid name!" };
    if (!emailValidation(registerForm.email)) emptyData.email = { msg: "Enter a valid email!" };
    if (!passwordValidation(registerForm.password)) emptyData.password = { msg: "Enter a 6 to 12 characters password. Must have letters and numbers only!" };

    var validationErrors = emptyData.firstName || emptyData.lastName || emptyData.email || emptyData.password
    if (validationErrors) {
        res.render('register', {
            empty: emptyData,
            form: registerForm,
            layout: 'main'
        });
    } else {
        // Define registration email
        var response = {
            body: {
                name: registerForm.firstName + " " + registerForm.lastName,
                intro: ["Welcome to LiveFit!", "We're so happy you joined, and wanted to take a moment to say hello.", "Let's be fit with us!", "Have a great day!"],
                signature: "Sincerely"
            }
        };

        let mail = mailGenerator.generate(response);

        let mailOptions = {
            from: EMAIL,
            to: req.body.email,
            subject: 'Welcome to LiveFit!',
            html: mail
        };

        // Send registration email and load dashboard.
        transporter.sendMail(mailOptions).then(() => {
            return res.render('dashboard', { form: registerForm, layout: 'main' });
        }).catch(() => res.status(400).json({ message: 'Something went wrong' }));
    }
};
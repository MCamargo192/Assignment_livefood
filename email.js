module.exports.mailSender = req => {
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


    // Define registration email
    var response = {
        body: {
            name: registerForm.firstName + " " + registerForm.lastName,
            intro: ["Welcome to LiveFit!", "We're so happy you joined, and wanted to take a moment to say hello.", "Let's be fit with us!", "Have a great day!"],
            signature: "Sincerely"
        }
    };

    var mail = mailGenerator.generate(response);

    var mailOptions = {
        from: EMAIL,
        to: req.body.email,
        subject: 'Welcome to LiveFit!',
        html: mail
    };

    var sender = {
        transp : transporter,
        mailOption: mailOptions,
        form: registerForm
    } 

    return sender;

};
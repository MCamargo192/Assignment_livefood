// Set mailsender module
const nodemailer = require('nodemailer');
const mailGen = require('mailgen');
require('dotenv').config();

const EMAIL = process.env.DB_EMAIL;
const PASSWORD = process.env.DB_PASSWORD;
const MAIN_URL = process.env.DB_MAIN_URL;



module.exports.mailSender = req => {
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
        theme: "cerberus",
        product: {
            name: "LiveFood",
            link: MAIN_URL
        }
    });

    // Holder values
    var registerForm = req.body;


    // Define registration email
    var response = {
        body: {
            name: registerForm.firstName + " " + registerForm.lastName,
            intro: ["Welcome to LiveFood!", "We're so happy you joined, and wanted to take a moment to say hello.", "Let's be fit with us!", "Have a great day!"],
            signature: "Sincerely"
        }
    };

    var mail = mailGenerator.generate(response);

    var mailOptions = {
        from: EMAIL,
        to: req.body.email,
        subject: 'Welcome to LiveFood!',
        html: mail
    };

    var sender = {
        transp: transporter,
        mailOption: mailOptions
    }

    return sender;

};

module.exports.checkoutMail = info => {
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
        theme: "cerberus",
        product: {
            name: "LiveFood",
            link: MAIN_URL
        }
    });

    let products = [];

    info.items.forEach(item => {
        let pack = {
            packages: item.title,
            meals: item.numberMeals,
            price: "$" + item.price,
            quantity: item.quantity
        }
        products.push(pack);
    });

    let summary = [];
    let details = {
        details: "Order Subtotal:",
        value: "$" + info.subtotal
    };
    summary.push(details);
    details = {
        details: "Shipping and handling:",
        value: "$" + info.shipping
    };
    summary.push(details);
    details = {
        details: "Tax:",
        value: "$" + info.tax
    };
    summary.push(details);
    details = {
        details: "Total:",
        value: "$" + info.total
    };
    summary.push(details);

    let shipping = [];
    if (info.apartment)
        shippingInfo = { shipping: "Address: #" + info.apartment + " - " + info.address + " - " + info.city + ", " + info.province + " - " + info.postalcode };
    else
        shippingInfo = { shipping: "Address: " + info.address + " - " + info.city + ", " + info.province + " - " + info.postalcode };
    shipping.push(shippingInfo);
    if (info.instructions) {
        shippingInfo = { shipping: "Special Instructions: " + info.instructions };
        shipping.push(shippingInfo);
    }

    // Define registration email
    var response = {
        body: {
            name: info.fname + " " + info.lname,
            intro: ["We are glad you ordered some of our products!"],
            table: [{
                title: "Your order",
                data: products,
                columns: {
                    customAlignment: {
                        meals: 'right',
                        price: 'right',
                        quantity: 'right'
                    }
                }
            },
            {
                // title: "Order Summary",
                data: summary,
                columns: {
                    customWidth: {
                        details: '70%',
                        value: '30%'
                    },
                    customAlignment: {
                        details: 'left',
                        value: 'right'
                    }
                }
            },
            {
                // title: "Shipping information",
                data: shipping,
                columns: {
                    customWidth: {
                        shipping: '100%'
                    },
                    customAlignment: {
                        shipping: 'left',
                    }
                }
            }],
            outro: ['Need help, or have questions?', 'Just reply to this email, we\'d love to help.'],
            signature: "Sincerely"
        }
    };

    var mail = mailGenerator.generate(response);

    var mailOptions = {
        from: EMAIL,
        to: info.email,
        subject: 'LiveFood Order',
        html: mail
    };

    var sender = {
        transp: transporter,
        mailOption: mailOptions
    }

    return sender;

};
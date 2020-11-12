// Login validation
module.exports.loginValid = req => {
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

    var validation = {
        valid: validationErrors,
        empty: emptyData,
        form: loginForm
    }
    return validation;
};
//Register Validation
module.exports.registerValid = req => {
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

    if (!registerForm.firstName.trim()) emptyData.firstName = { msg: "Enter a valid name!" };
    if (!registerForm.lastName.trim()) emptyData.lastName = { msg: "Enter a valid name!" };
    if (!emailValidation(registerForm.email)) emptyData.email = { msg: "Enter a valid email!" };
    if (!passwordValidation(registerForm.password)) emptyData.password = { msg: "Enter a 6 to 12 characters password. Must have letters and numbers only!" };

    var errors = emptyData.firstName || emptyData.lastName || emptyData.email || emptyData.password

    var validation = { 
        valid: errors,
        empty: emptyData,
        form: registerForm
    }
    return validation;
};
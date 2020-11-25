const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const userSchema = require("./data_models/registrationModel.js");

module.exports = (connectionString) => {
    let User;
    return {
        connect: () => {
            return new Promise((resolve, reject) => {
                let db = mongoose.createConnection(connectionString,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useCreateIndex: true
                    });

                db.on('error', (err) => { reject(err); });
                db.once('open', () => {
                    User = db.model("users", userSchema);
                    resolve();
                });
            });
        },
        getUserByEmail: form => {
            return new Promise((resolve, reject) => {
                User.find({ email: form.email })
                    .exec()
                    .then(result => { resolve(result); })
                    .catch(err => { reject(err); })
            })
        },
        addUser: userData => {
            return new Promise((resolve, reject) => {
                bcrypt.hash(userData.password, 10)
                    .then(hash => {
                        let newUser = new User();
                        newUser.firstName = userData.firstName;
                        newUser.lastName = userData.lastName;
                        newUser.email = userData.email;
                        newUser.password = hash;
                        newUser.role = "User";

                        newUser.save((err, addedUser) => { err ? reject(err) : resolve(addedUser._id); });
                    }).catch(err => { console.log(err); });
            });
        }
    }
}
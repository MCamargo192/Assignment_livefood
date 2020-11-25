const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const packagesModel = require("./data_models/mealsModel.js");

module.exports = () => {
    return {
        getTopPackages: () => {
            return new Promise((resolve, reject) => {
                packagesModel.find({ isTopPackage: true })
                    .exec()
                    .then(result => {
                        packages = result.map(pack => pack.toObject());
                        resolve(packages);
                    })
                    .catch(err => { reject(err); });
            })
        },
        getAllPackages: () => {
            return new Promise((resolve, reject) => {
                packagesModel.find()
                    .exec()
                    .then(result => {
                        packages = result.map(pack => pack.toObject());
                        resolve(packages);
                    })
                    .catch(err => { reject(err); });
            })
        },
        getPackageById: id => {
            return new Promise((resolve, reject) => {
                packagesModel.find({ _id: id })
                    .exec()
                    .then(result => { resolve(result); })
                    .catch(err => { reject(err); })
            })
        },
        addPackage: package => { 
            return new Promise((resolve, reject) => {
                let newPack = new packagesModel();
                newPack.src = package.src;
                newPack.title = package.title;
                newPack.description = package.description;
                newPack.synopsis = package.synopsis;
                newPack.price = package.price;
                newPack.numberMeals = package.numberMeals;
                newPack.isTopPackage = package.isTopPackage;

                newPack.save((err, addedPack) => { err ? reject(err) : resolve(addedPack._id); });
            })
        },
        updatePackage: (id, package) => {
            return new Promise((resolve, reject) => {
                packagesModel.findByIdAndUpdate(id, package)
                    .exec()
                    .then(result => { resolve(result); })
                    .catch(err => { reject(err); })
            })
        },
        deletePackage: id => {
            return new Promise((resolve, reject) => {
                packagesModel.findByIdAndRemove(id)
                    .exec()
                    .then(() => { resolve(); })
                    .catch(err => { reject(err); })
            })
        }
    }
}

// // Packages of meals
// var packages = [
//     {
//         id: 1,
//         src: '/img/weightloss_cover.jpg',
//         title: "Weight Loss",
//         description: 'Not feelin\' green salad tonight? These flavor-packed dinners will leave you satisfied and on track for weight loss.',
//         synopsis: 'This package comes with a variety of meals for lunch and dinner. Each meal has been properly portion controlled to help you lose weight! The longer you stick with it, the better the results will get.',
//         price: 145.99,
//         numberMeals: 15,
//         meals: {
//             first: '/img/weightloss_1.jpg',
//             second: '/img/weightloss_2.jpg',
//             third: '/img/weightloss_3.jpg',
//             fourth: '/img/weightloss_4.jpg'
//         },
//         isTopPackage: true
//     },
//     {
//         id: 2,
//         src: '/img/muscle_cover.jpg',
//         title: 'Muscle Gain',
//         description: 'Whether you’re just starting out in the world of fitness, or you’re a seasoned pro, try these tasty meals for muscle-building and fat-loss.',
//         synopsis: 'Designed to help you gain lean muscle mass. Larger portions of protein and carbohydrates to help hit your health and fitness goals. Build muscle, improve your health and have more energy!',
//         price: 183.99,
//         numberMeals: 20,
//         meals: {
//             first: '/img/muscle_1.jpg',
//             second: '/img/muscle_2.jpg',
//             third: '/img/muscle_3.jpg',
//             fourth: '/img/muscle_4.jpg'
//         },
//         isTopPackage: true
//     },
//     {
//         id: 3,
//         src: '/img/glutenfree_cover.jpg',
//         title: 'Gluten-Free',
//         description: 'Following a gluten-free diet shouldn\'t mean eating plain chicken and boring salads every night.',
//         synopsis: 'The Gluten-Free Package comes with a variety of our best selling meals. Each meal in this package contains 1 cup of Carbohydrates, 1 cup of Vegetables and 5oz of meat protein',
//         price: 117.99,
//         numberMeals: 18,
//         isTopPackage: true
//     },
//     {
//         id: 4,
//         src: '/img/vegan_cover.jpg',
//         title: 'Vegan',
//         description: 'Here is a DELICIOUS Vegan Meals. All recipes are gluten-free & low-calorie.',
//         synopsis: 'This package includes a variety of plant based meals including veggie chicken, veggie beef, veggie ground beef.',
//         price: 134.99,
//         numberMeals: 22,
//         isTopPackage: true
//     },
//     {
//         id: 5,
//         src: '/img/vegetarian_cover.jpg',
//         title: 'Vegetarian',
//         description: 'Want to eat less meat or incorporate more plant-based food into your meals? This package has a combination that will ensure a well-balanced vegetarian diet.',
//         synopsis: 'This package includes a variety of plant based meals including tofu, a variety of fresh vegetables, seasonings, sauces and carbohydrates including rice, yams, pasta, butternut ravioli, potatoes and quinoa.',
//         price: 128.99,
//         numberMeals: 21,
//         meals: {
//             first: '/img/vegetarian_1.jpg',
//             second: '/img/vegetarian_2.jpg',
//             third: '/img/vegetarian_3.jpg',
//             fourth: '/img/vegetarian_4.jpg'
//         },
//         isTopPackage: false
//     }
// ];
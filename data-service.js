// Individual Meals
var meals = [
    {
        id: 1,
        src: '/img/TurkeyWhiteChili.jpg',
        title: 'Turkey White Chili',
        price: 15.99,
        ingredients: 'Canola Oil, Chopped Onion, Garlic Cloves, Cumin, Turkey Breast',
        values: {
            calories: 537,
            protein: 39.7,
            carbs: 81.7,
            fat: 7.1
        },
        foodCategory: "Weight Loss",
        isTopPackage: true
    },
    {
        id: 2,
        src: '/img/VeganSpaghetti.jpg',
        title: 'Vegan Spaghetti and Meatballs',
        price: 12.99,
        ingredients: 'Marinara Sauce, Kidney Beans, Gluten-free quick oats, Soy sauce, Mustard, Onion Powder, Garlic Powder, Oregano, Chili Powder',
        values: {
            calories: 325,
            protein: 32,
            carbs: 41,
            fat: 2.4
        },
        foodCategory: "Vegan",
        isTopPackage: true
    },
    {
        id: 3,
        src: '/img/ChipotleLimeShrimp.jpg',
        title: 'Sheet-Pan Chipotle-Lime Shrimp Bake',
        price: 17.99,
        ingredients: 'Baby Red Potatoes, Olive Oil, Sea Salt, Limes, Chipotle pepper, Asparagus, Broccoli, Shrimp, Cilantro',
        values: {
            calories: 549,
            protein: 40,
            carbs: 79,
            fat: 7.1
        },
        foodCategory: "Gluten-Free",
        isTopPackage: true
    },
    {
        id: 4,
        src: '/img/SalmonMeal.jpg',
        title: 'Spicy Cajun Salmon & Garlicky Veg',
        price: 19.99,
        ingredients: 'Salmon Fillets, Lemon, Garlic, Cajun, Olive Oil, Sea Salt, Black Pepper, Couscous, Brocolli, Courgettes',
        values: {
            calories: 631,
            protein: 13,
            carbs: 88,
            fat: 22.0
        },
        foodCategory: "Muscle-Gain",
        isTopPackage: true
    }
]

// Packages of meals
var packages = [
    {
        id: 1,
        src: '/img/weightloss_cover.jpg',
        title: "Weight Loss",
        description: 'Not feelin\' green salad tonight? These flavor-packed dinners will leave you satisfied and on track for weight loss.',
        synopsis: 'This package comes with a variety of meals for lunch and dinner. Each meal has been properly portion controlled to help you lose weight!<br><br>The longer you stick with it, the better the results will get.',
        price: 145.99,
        numberMeals: 15,
        meals: {
            first: '/img/weightloss_1.jpg',
            second: '/img/weightloss_2.jpg',
            third: '/img/weightloss_3.jpg',
            fourth: '/img/weightloss_4.jpg'
        },
        isTopPackage: false
    },
    {
        id: 2,
        src: '/img/muscle_cover.jpg',
        title: 'Muscle Gain',
        description: 'Whether you’re just starting out in the world of fitness, or you’re a seasoned pro, try these tasty meals for muscle-building and fat-loss.',
        synopsis: 'Designed to help you gain lean muscle mass. Larger portions of protein and carbohydrates to help hit your health and fitness goals.<br><br>Build muscle, improve your health and have more energy!',
        price: 183.99,
        numberMeals: 20,
        meals: {
            first: '/img/muscle_1.jpg',
            second: '/img/muscle_2.jpg',
            third: '/img/muscle_3.jpg',
            fourth: '/img/muscle_4.jpg'
        },
        isTopPackage: false
    },
    {
        id: 3,
        src: '/img/glutenfree_cover.jpg',
        title: 'Gluten-Free',
        description: 'Following a gluten-free diet shouldn\'t mean eating plain chicken and boring salads every night.',
        synopsis: 'The Gluten-Free Package comes with a variety of our best selling meals.<br><br>Each meal in this package contains 1 cup of Carbohydrates, 1 cup of Vegetables and 5oz of meat protein',
        price: 117.99,
        numberMeals: 18,
        meals: {
            first: '/img/glutenfree_1.jpg',
            second: '/img/glutenfree_2.jpg',
            third: '/img/glutenfree_3.jpg',
            fourth: '/img/glutenfree_4.jpg'
        },
        isTopPackage: false
    },
    {
        id: 4,
        src: '/img/vegan_cover.jpg',
        title: 'Vegan',
        description: 'Here is a DELICIOUS Vegan Meals. All recipes are gluten-free & low-calorie.',
        synopsis: 'This package includes a variety of plant based meals including veggie chicken, veggie beef, veggie ground beef, tofu, a variety of fresh vegetables, seasonings, sauces and carbohydrates including rice, yams, pasta, butternut ravioli, potatoes and quinoa.',
        price: 134.99,
        numberMeals: 22,
        meals: {
            first: '/img/vegan_1.jpg',
            second: '/img/vegan_2.jpg',
            third: '/img/vegan_3.jpg',
            fourth: '/img/vegan_4.jpg'
        },
        isTopPackage: false
    }
];

// Methods
// Get one meal
module.exports.getMeal = mealId => meals.filter(meal => meal.id === mealId);

// Get all meals
module.exports.getAllMeals = () => meals;

// Get one package
module.exports.getPackage = packageId => packages.filter(package => package.id === packageId);

// Get all packages
module.exports.getAllPackages = () => packages;
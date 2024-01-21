const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Assuming you have a logged-in user
const user = new User({ username: 'test', password: 'test' });
user.save()
    .then(user => {
        const recipe = new Recipe({
            title: 'Test Recipe',
            ingredients: ['ingredient1', 'ingredient2'],
            instructions: 'Test instructions',
            user: user._id
        });
        recipe.save()
            .then(recipe => console.log(recipe))
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
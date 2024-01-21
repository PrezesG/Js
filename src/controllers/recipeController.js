const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res) => {
    try {
        if (!req.user || !req.body) {
            throw new Error('Invalid request');
        }
        const { title, ingredients, instructions } = req.body;
        const user = req.user._id;
        const recipe = new Recipe({ title, ingredients, instructions, user });
        await recipe.save();
        
        res.redirect('/recipes');
    } catch (err) {
        console.log(err);
        res.redirect('/recipe/new');
    }
};
  

  const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.render('recipes', { recipes: recipes });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
        if (!recipe) {
            return res.status(404).json({ success: false, error: 'No recipe found' });
        }

        res.render('recipes/edit', { recipe: recipe });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'No recipe found' });
    }
    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
        if (!recipe) {
            return res.status(404).json({ success: false, error: 'No recipe found' });
        }
        await recipe.deleteOne();
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const recipe = await Recipe.create(req.body);
    res.status(201).json({
      success: true,
      data: recipe
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      data: recipes
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'No recipe found' });
    }
    res.status(200).json({
      success: true,
      data: recipe
    });
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
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'No recipe found' });
    }
    await recipe.remove();
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
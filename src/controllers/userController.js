const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');


exports.showRegister = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/users/register.html'));
  };
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
exports.showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/users/login.html'));
  };
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid Credentials' });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
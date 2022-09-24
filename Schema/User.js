const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {type: String, required: true, index: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, required: true, index: true}
});

module.exports = mongoose.model('User', userSchema);
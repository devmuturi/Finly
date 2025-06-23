const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Creating a model
const User = model('User', UserSchema);

module.exports = User;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    friends: Array
});

const User = mongoose.model('user', userSchema);

module.exports = User;
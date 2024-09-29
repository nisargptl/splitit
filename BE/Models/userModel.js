const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    amount_owed: Number,
    // friends: Array
});

const User = mongoose.model('user', userSchema);

module.exports = User;
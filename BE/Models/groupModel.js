const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
    created_by_name: String,
    created_by_user_id: String,
    members: Array,
    transactions: Array
});

const Group = mongoose.model('group', groupSchema);

module.exports = Group;
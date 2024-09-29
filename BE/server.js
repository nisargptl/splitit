const express = require('express');
const mongoose = require('mongoose');
const User = require('./Models/userModel');
const Group = require('./Models/groupModel');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log('MongoDB connection error:', err));

app.post('/api/user', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password,
            friends: []
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/group', async (req, res) => {
    try {
        const { name, created_by_name, created_by_user_id, members, transactions } = req.body;

        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Group name already exists' });
        }

        // Create new group
        const newGroup = new Group({
            name,
            created_by_name,
            created_by_user_id,
            members,
            transactions: transactions || []
        });

        // Save the group to the database
        await newGroup.save();
        res.status(201).json({ message: 'Group created successfully', group: newGroup });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/group/:id', async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/group/:id', async (req, res) => {
    try {
        const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body);
        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ prevData: updatedGroup, updatedData: req.body});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/group/:id', async (req, res) => {
    try {
        const deletedGroup = await Group.findByIdAndDelete(req.params.id);
        if (!deletedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/transaction/:groupId', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { txn_id, txn_name, payer_id, name, payees, amount, is_recurring } = req.body;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Create new transaction
        const newTransaction = new Object({
            txn_id,
            txn_name,
            payer_id,
            name,
            payees,
            amount,
            is_recurring: is_recurring || false,
            date: new Date()
        });

        // Append the transaction to the database
        group.transactions.push(newTransaction);
        await group.save();
        res.status(201).json({ message: 'Transaction added successfully', Transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/transaction/:groupId/:id', async (req, res) => {
    try {
        const txnId = req.params.id;
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const transaction = group.transactions.find(transaction => transaction.txn_id === txnId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/transaction/:groupId/:id', async (req, res) => {
    try {
        const txnId = req.params.id;
        const groupId = req.params.groupId;
        const updatedTransactionData = req.body;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const index = group.transactions.findIndex(transaction => transaction.txn_id === txnId);
        if (index !== -1) {
            group.transactions[index] = {
                ...updatedTransactionData 
            }
            await group.save();
        } else {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ updatedData: req.body});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/transaction/:groupId/:id', async (req, res) => {
    try {
        const txnId = req.params.id;
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const index = group.transactions.findIndex(transaction => transaction.txn_id === txnId);
        if (index !== -1) {
            group.transactions.splice(index, 1);
            await group.save();
        } else {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./Models/userModel');
const Group = require('./Models/groupModel');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require("dotenv").config();
const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const app = express();
const PORT = process.env.PORT || 9000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log('MongoDB connection error:', err));

app.post('/api/user', async (req, res) => {
    try {
        console.log('new user request')
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer {ACCESS_TOKEN}"
        
        // Make a GET request to another service using the token
        const userInfoUrl = `https://dev-2kxnqmzpaoclydf0.us.auth0.com/userinfo`;
        const userInfoResponse = await axios.get(userInfoUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        email = userInfoResponse.data.email
        name = userInfoResponse.data.name
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            existingUser.name = name;
            await existingUser.save();
            return res.status(200).json({ message: 'User name updated successfully', user: existingUser });
        }

        // // Create new user
        const newUser = new User({
            name,
            email,
            amount_owed: 0
        });

        // Save the user to the database
        const data = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: data });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/userList/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const users = await User.find({}, { name: 1 });
        if (!users) {
            return res.status(404).json({ message: 'Users not found' });
        }
        const filteredUsers = users.filter(user => user._id != userId);
        res.status(200).json(filteredUsers);
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

app.get('/api/userGroups/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const groups = await Group.find({ "members.user_id": userId });
        if (!groups || groups.length === 0) {
            return res.status(404).json({ message: 'Groups not found' });
        }
        res.status(200).json(groups);
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
        const { txn_name, payer_id, name, payees, amount, is_recurring } = req.body;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Create new transaction
        const newTransaction = new Object({
            txn_id: new mongoose.Types.ObjectId().toString(),
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

        // Calculate group amount for members
        const amountOwed = {};
        group.members.forEach(member => {
            amountOwed[member.user_id] = 0;
        });

        group.transactions.forEach(transaction => {
            transaction.payees.forEach(payee => {
                if (payee.user_id === transaction.payer_id) {
                    amountOwed[payee.user_id] += payee.amount;
                } else {
                    amountOwed[payee.user_id] -= payee.amount;
                }
            });
        });

        group.members.forEach(member => {
            member.amount_owed = amountOwed[member.user_id];
        });

        group.markModified('members');

        // Save in DB
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

app.post('/api/group', async (req, res) => {
    try {
        console.log(req.body)
        const emails = req.body.emails;
        const existingUsers = await User.find({email: {$in: emails}}).toArray();
        const missingUsers = emails.filter(email => !existingUsers.includes(email));
        
        res.status(200).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Generate a pre-signed URL for S3
app.get('/generate-presigned-url', async (req, res) => {
    const { fileName, fileType } = req.query;

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${fileName}`,
        ContentType: fileType,
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: 'Error generating pre-signed URL' });
    }
})

app.get('/api/userAmount/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const groups = await Group.find({ "members.user_id": userId }, { members: 1 });
        if (!groups) {
            return res.status(404).json({ amount_owed : 0, message: 'No User group found' });
        }
        const amountOwed = groups.reduce((total, group) => {
            const user = group.members.find(member => member.user_id === userId);
            if (user) {
                return total + user.amount_owed;
            }
            return total;
        }, 0);
        res.status(200).json({ amount_owed : amountOwed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

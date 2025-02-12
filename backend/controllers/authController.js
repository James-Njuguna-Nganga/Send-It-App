const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
const { sendEmail } = require('../services/emailService');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(name, email, hashedPassword);
        await sendEmail(email, 'Welcome!', 'Your account has been created.');

        res.status(201).json({ message: 'User registered successfully', userId: user.UserID });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.Password)))
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

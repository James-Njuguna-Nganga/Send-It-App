const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByEmail, createUser } = require('../models/userModel');
const { sendWelcomeEmail } = require('../services/emailService');

exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(fullName, email, hashedPassword);
    sendWelcomeEmail(email);
    res.status(201).json({ message: 'User registered successfully' });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 5000;

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

const USERS_FILE = 'users.json';

async function getUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

app.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

        const users = await getUsers();

        if (users.some(user => user.email === email)) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: Date.now(),
            fullName: fullName,
            email: email,
            password: hashedPassword,
            role: '0' // Default role: 0 = user, 1 = admin
        };

        users.push(newUser);
        await saveUsers(users);

        res.status(201).json({ message: 'Registration successful!' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

        const users = await getUsers();
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        
        // Check if the user's role matches the selected role
        if (user.role !== role) {
            return res.status(400).json({ message: 'Incorrect role selected.' });
        }

        // Authentication successful
        res.status(200).json({
            message: 'Login successful!',
            role: user.role // Send the user's role back to the client
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
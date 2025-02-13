const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

// Helper function for token generation
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(
        { 
            id: user.UserID, 
            role: user.Role,
            isAdmin: user.Role === 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Helper function to hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email', sql.NVarChar(255), email)
            .execute('GetUserByEmail');

        const user = result.recordset[0];
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log('User role:', user.Role);
        const isValidPassword = await bcrypt.compare(password, user.Password);
        console.log('Password verification result:', isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user);
        console.log('Token generated successfully');

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                isAdmin: user.Role === 'admin'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Register controller
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const pool = await poolPromise;
        const userExists = await pool.request()
            .input('Email', sql.NVarChar(255), email)
            .execute('GetUserByEmail');

        if (userExists.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await hashPassword(password);

        const result = await pool.request()
            .input('Name', sql.NVarChar(255), name)
            .input('Email', sql.NVarChar(255), email)
            .input('Password', sql.NVarChar(255), hashedPassword)
            .input('Role', sql.NVarChar(50), 'user')
            .execute('CreateUser');

        const newUser = result.recordset[0];
        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.UserID,
                name: newUser.Name,
                email: newUser.Email,
                role: newUser.Role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create Admin controller
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const pool = await poolPromise;
        const hashedPassword = await hashPassword(password);

        const result = await pool.request()
            .input('Name', sql.NVarChar(255), name)
            .input('Email', sql.NVarChar(255), email)
            .input('Password', sql.NVarChar(255), hashedPassword)
            .input('Role', sql.NVarChar(50), 'admin')
            .execute('CreateUser');

        const newAdmin = result.recordset[0];
        const token = generateToken(newAdmin);

        res.status(201).json({
            success: true,
            message: 'Admin user created successfully',
            token,
            user: {
                id: newAdmin.UserID,
                name: newAdmin.Name,
                email: newAdmin.Email,
                role: newAdmin.Role,
                isAdmin: true
            }
        });
    } catch (error) {
        console.error('Admin creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating admin user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get Current User controller
const getCurrentUser = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, req.user.id)
            .execute('GetUserById');

        const user = result.recordset[0];
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                isAdmin: user.Role === 'admin'
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user details',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    login,
    register,
    createAdmin,
    getCurrentUser
};
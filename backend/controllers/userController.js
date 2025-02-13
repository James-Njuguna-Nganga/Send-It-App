const { sql, poolPromise } = require('../config/db');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .execute('GetAllUsers');

        const formattedUsers = result.recordset.map(user => ({
            id: user.UserID,
            name: user.Name,
            email: user.Email,
            role: user.Role,
            isAdmin: user.Role === 'admin'
        }));

        res.status(200).json({
            success: true,
            count: formattedUsers.length,
            data: formattedUsers
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('Getting user with ID:', userId); // Debug log

        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
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
            data: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                isAdmin: user.Role === 'admin'
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        console.log('User from token:', req.user); // Debug log

        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, req.user.id)
            .execute('GetUserById');

        if (!result.recordset[0]) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.recordset[0];
        res.status(200).json({
            success: true,
            data: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                isAdmin: user.Role === 'admin'
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update user profile
const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserId', sql.Int, req.user.id)
            .input('Name', sql.VarChar(255), name)
            .input('Email', sql.VarChar(255), email)
            .execute('UpdateUser');

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Deleting user with ID:', userId); // Debug log

        const pool = await poolPromise;
        
        // First check if user exists
        const checkUser = await pool.request()
            .input('UserID', sql.Int, userId)
            .execute('GetUserById');

        if (!checkUser.recordset[0]) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete the user
        await pool.request()
            .input('UserID', sql.Int, userId)
            .execute('DeleteUser');

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Input validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both current and new password'
            });
        }

        const pool = await poolPromise;
        
        // Get user with password
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .execute('GetUserById');

        const user = result.recordset[0];
        console.log('Found user:', user ? 'Yes' : 'No'); // Debug log

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.Password);
        console.log('Password verification:', isValidPassword ? 'Success' : 'Failed'); // Debug log

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Password', sql.NVarChar(255), hashedPassword)
            .execute('UpdateUserPassword');

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getAllUsers,
    getUserProfile,
    getUser,
    updateUser,
    deleteUser,
    changePassword
};
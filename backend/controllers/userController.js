const { 
    getUserByEmail, 
    getUserById,
    createOrUpdateUser, 
    getAllUsersFromDB 
} = require('../models/userModel');

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await getUserByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {
                userId: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Get Single User
exports.getUser = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await createOrUpdateUser({
            userId: req.user.userId,
            ...req.body
        });
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersFromDB();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};
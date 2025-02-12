const { getUserByEmail } = require('../models/userModel');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await getUserByEmail(req.user.email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            userId: user.UserID,
            name: user.Name,
            email: user.Email,
            createdAt: user.CreatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

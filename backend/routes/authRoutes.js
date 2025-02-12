const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../validations/authValidation');

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;

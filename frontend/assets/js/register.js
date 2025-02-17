import { log } from 'console';
import { register } from './services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
    const regAPI = 'http://localhost:5000/api/auth/register';
    const registerForm = document.getElementById('registerForm');
    const messageBox = document.getElementById('message-box');

    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.classList.remove('hidden');
        
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }

    function validatePassword(password) {
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        return null;
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;

        const newUser = {
            name,
            email,
            password
        }

        // Basic validation
        if (!name || !email || !password) {
            showMessage('All fields are required', 'error');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            showMessage(passwordError, 'error');
            return;
        }

        try {
            const response = await register(name, email, password);
            const res = await fetch(regAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            const data = await res.json()
            if(!res.ok){
                throw new Error(data.message || 'Registration failed')
            }
            console.log(data)
            
            if (response.success) {
                showMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showMessage(response.message || 'Registration failed', 'error');
            }
        } catch (error) {
            showMessage(error.message || 'An error occurred', 'error');
        }
    });
});
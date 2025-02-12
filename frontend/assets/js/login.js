import AuthService from './services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageBox = document.getElementById('message-box');

    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.classList.remove('hidden');
        
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.querySelector('input[name="role"]:checked')?.value;

        if (!role) {
            showMessage('Please select a role', 'error');
            return;
        }

        try {
            if (email && password) {
                const userData = {
                    email,
                    role,
                    token: 'demo-token'
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 5000);
            } else {
                showMessage('Invalid credentials', 'error');
            }
        } catch (error) {
            showMessage(error.message || 'Login failed', 'error');
        }
    });
});
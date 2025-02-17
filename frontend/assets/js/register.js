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

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;

        // Basic validation
        if (!name || !email || !password) {
            showMessage('All fields are required', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            showMessage(passwordError, 'error');
            return;
        }

        try {
            const response = await fetch(regAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            showMessage('Registration successful! Redirecting to login...', 'success');
            
            // Store success message in sessionStorage for login page
            sessionStorage.setItem('registrationSuccess', 'true');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            showMessage(error.message || 'An error occurred during registration', 'error');
        }
    });
});
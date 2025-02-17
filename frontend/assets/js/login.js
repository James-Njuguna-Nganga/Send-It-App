document.addEventListener('DOMContentLoaded', () => {
    const loginAPI = 'http://localhost:5000/api/auth/login';
    const loginForm = document.getElementById('loginForm');
    const messageBox = document.getElementById('message-box');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Check for registration success message
    const registrationSuccess = sessionStorage.getItem('registrationSuccess');
    if (registrationSuccess) {
        showMessage('Registration successful! Please login.', 'success');
        sessionStorage.removeItem('registrationSuccess');
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        // Validate inputs
        if (!email || !password) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        try {
            // Disable form while processing
            setFormLoading(true);

            const response = await fetch(loginAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store user data and token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    isAdmin: data.isAdmin
                }));

                showMessage('Login successful! Redirecting...', 'success');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message || 'An error occurred during login', 'error');
            setFormLoading(false);
        }
    });

    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.classList.remove('hidden');

        // Auto-hide message after 3 seconds
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function setFormLoading(isLoading) {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const inputs = loginForm.querySelectorAll('input');

        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Logging in...' : 'Login';
        
        inputs.forEach(input => {
            input.disabled = isLoading;
        });
    }

    // Handle "Enter" key press
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
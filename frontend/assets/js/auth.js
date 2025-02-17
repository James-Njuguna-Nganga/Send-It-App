document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageBox = document.getElementById('message-box');

    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            // Show loading state
            showMessage('Logging in...', 'info');

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const roleElement = document.querySelector('input[name="role"]:checked');

            if (!email || !password || !roleElement) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }

            const role = roleElement.value;

            // Check if server is available first
            try {
                await fetch('http://localhost:5000/health');
            } catch (error) {
                showMessage('Server is not available. Please try again later.', 'error');
                return;
            }

            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Login successful! Redirecting...', 'success');
                
                // Store user data in session storage
                sessionStorage.setItem('currentUser', JSON.stringify({
                    email: email,
                    role: role
                }));

                // Redirect based on role
                setTimeout(() => {
                    window.location.href = role === '1' ? 'dashboard.html' : 'dashboard.html';
                }, 1500);
            } else {
                showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Cannot connect to server. Please check your connection.', 'error');
        }
    });

    function showMessage(message, type) {
        if (!messageBox) {
            console.error('Message box not found');
            return;
        }
<<<<<<< HEAD

        // Assuming you have a token from the server, set it in local storage
        const token = "your_generated_token"; // Replace with actual token from server
        localStorage.setItem("token", token);

        localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
        showMessage("Login successful! Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    }

    function showMessage(message, type) {
=======
>>>>>>> Samuel
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.classList.remove('hidden');

        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
});
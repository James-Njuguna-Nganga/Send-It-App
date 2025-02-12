document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const nameField = document.getElementById("name");
    const roleField = document.getElementById("role");
    const submitButton = document.querySelector(".btn");
    const toggleText = document.getElementById("toggleForm");
    const form = document.getElementById("authForm");
    const messageBox = document.getElementById("message-box");

    let isLogin = true;

    function toggleForm() {
        isLogin = !isLogin;
        formTitle.textContent = isLogin ? "Login" : "Register";
        nameField.classList.toggle("hidden", isLogin);
        roleField.classList.toggle("hidden", isLogin);
        submitButton.textContent = isLogin ? "Login" : "Register";
        toggleText.innerHTML = isLogin ? "Register" : "Login";
    }

    toggleText.addEventListener("click", toggleForm);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (isLogin) {
            handleLogin(email, password);
        } else {
            const fullName = document.getElementById("name").value;
            const role = document.getElementById("role").value;
            handleRegistration(fullName, email, password, role);
        }
    });

    async function handleLogin(email, password) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                showMessage("Invalid email or password", "error");
                return;
            }

            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }));

            showMessage("Login successful! Redirecting...", "success");
            
            setTimeout(() => {
                if (user.role === "1") {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            }, 1500);

        } catch (error) {
            showMessage("Login failed: " + error.message, "error");
        }
    }

    async function handleRegistration(fullName, email, password, role) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(user => user.email === email)) {
                showMessage("Email already registered", "error");
                return;
            }

            const newUser = {
                id: Date.now(),
                fullName,
                email,
                password,
                role,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            showMessage("Registration successful! Please login.", "success");
            setTimeout(() => {
                toggleForm();
                form.reset();
            }, 1500);

        } catch (error) {
            showMessage("Registration failed: " + error.message, "error");
        }
    }

    function showMessage(message, type) {
        const messageBox = document.getElementById("message-box");
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.classList.remove('hidden');
        
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
});
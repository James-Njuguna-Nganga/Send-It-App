document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const nameField = document.getElementById("name");
    const submitButton = document.querySelector(".btn");
    const toggleText = document.getElementById("toggleForm");
    const form = document.getElementById("authForm");
    const messageBox = document.getElementById("message-box");

    let isLogin = true; // Track login or register mode

    function toggleForm() {
        isLogin = !isLogin;

        if (isLogin) {
            formTitle.textContent = "Login";
            nameField.classList.add("hidden");
            submitButton.textContent = "Login";
            toggleText.innerHTML = `Don't have an account? <span>Register</span>`;
        } else {
            formTitle.textContent = "Register";
            nameField.classList.remove("hidden");
            submitButton.textContent = "Register";
            toggleText.innerHTML = `Already have an account? <span>Login</span>`;
        }

        document.querySelector("#toggleForm span").addEventListener("click", toggleForm);
    }

    toggleText.addEventListener("click", toggleForm);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const fullName = isLogin ? null : document.getElementById("name").value;

        if (!email || !password || (!isLogin && !fullName)) {
            showMessage("Please fill in all required fields.", "error");
            return;
        }

        if (isLogin) {
            loginUser(email, password);
        } else {
            registerUser(fullName, email, password);
        }
    });

    function registerUser(fullName, email, password) {
        const user = { fullName, email, password };
        localStorage.setItem("registeredUser", JSON.stringify(user));
        showMessage("Registration successful! Please log in.", "success");
        toggleForm();
    }

    function loginUser(email, password) {
        const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

        if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
            showMessage("Invalid email or password.", "error");
            return;
        }

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
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.style.display = "block";

        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000);
    }
});
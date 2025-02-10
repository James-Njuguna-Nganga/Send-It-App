document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const nameField = document.getElementById("name");
    const submitButton = document.querySelector(".btn");
    const toggleText = document.getElementById("toggleForm");
    const form = document.getElementById("authForm");

    let isLogin = true; // Track whether it's login or register mode

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

        // Reapply event listener since innerHTML update removes it
        document.querySelector(".toggle-text span").addEventListener("click", toggleForm);
    }

    // Attach event listener
    toggleText.addEventListener("click", toggleForm);

    // Handle form submission (example logic)
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const fullName = isLogin ? null : document.getElementById("name").value;

        if (!email || !password || (!isLogin && !fullName)) {
            showMessage("Please fill in all required fields.", "error");
            return;
        }

        showMessage(`${isLogin ? "Logging in..." : "Registering..."} Please wait.`, "success");

        // Here, you can implement AJAX or Fetch API calls to your backend for authentication
    });

    function showMessage(message, type) {
        const messageBox = document.getElementById("message-box");
        messageBox.textContent = message;
        messageBox.className = type;
        messageBox.style.display = "block";

        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000);
    }
});
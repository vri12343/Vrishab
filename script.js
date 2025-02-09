const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = user;
        next();
    });
}

//login Script.


document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signupForm");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordMeter = document.getElementById("password-strength-meter");
    const passwordStrengthText = document.getElementById("password-strength-text");
    const passwordMatchMsg = document.getElementById("password-match-msg");
    const emailInput = document.getElementById("email");
    const emailMsg = document.getElementById("email-msg");

    // Password Strength Checker
    passwordInput.addEventListener("input", function () {
        const value = passwordInput.value;
        let strength = 0;
        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;

        passwordMeter.value = strength;
        const strengthText = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
        passwordStrengthText.textContent = strengthText[strength];
    });

    // Confirm Password Validation
    confirmPasswordInput.addEventListener("input", function () {
        if (confirmPasswordInput.value !== passwordInput.value) {
            passwordMatchMsg.textContent = "Passwords do not match!";
            passwordMatchMsg.style.color = "red";
        } else {
            passwordMatchMsg.textContent = "Passwords match!";
            passwordMatchMsg.style.color = "green";
        }
    });

    // Check if Email Exists
    emailInput.addEventListener("blur", function () {
        fetch(`http://localhost:5000/check-email?email=${emailInput.value}`)
        .then(response => response.json())
        .then(data => {
            emailMsg.textContent = data.exists ? "Email already registered!" : "Email is available!";
            emailMsg.style.color = data.exists ? "red" : "green";
        });
    });

    // Handle Signup Submission
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.getElementById("username").value;
        let email = emailInput.value;
        let password = passwordInput.value;
        let confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Signup Successful! You can now log in.");
                window.location.href = "login.html";
            } else {
                alert("Signup Failed: " + data.message);
            }
        });
    });
});

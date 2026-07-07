import { login, register } from "../services/authService.js";
import { showLoading, hideLoading } from "../components/loading.js"

// =========================
// عناصر الصفحة
// =========================

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");

const loginError = document.getElementById("login-error");

const loginBtn = document.getElementById("loginBtn");

const registerBtn = document.getElementById("registerBtn");

// =========================
// الأحداث
// =========================

loginForm.addEventListener("submit", loginUser);

registerForm.addEventListener("submit", registerUser);

document.getElementById("showRegister").addEventListener("click", showRegister);

document.getElementById("showLogin").addEventListener("click", showLogin);

// =========================
// تسجيل الدخول
// =========================

async function loginUser(e) {

    e.preventDefault();

    loginError.style.display = "none";

    try {

        const email = document.getElementById("login-email").value;

        const password = document.getElementById("login-password").value;

        let data;
        showLoading(loginBtn);

        try {

           data = await login(email, password);

        }
        finally {

            hideLoading(loginBtn);

        }

        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("profile_image", data.profile_image);

        window.location.href = "index.html";
        
    } catch (error) {

        loginError.style.display = "block";

        loginError.textContent =
            error.response?.data?.message ||
            "فشل تسجيل الدخول";

    }

}

// =========================
// إنشاء حساب
// =========================

async function registerUser(e) {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
        "username",
        document.getElementById("register-username").value
    );

    formData.append(
        "email",
        document.getElementById("register-email").value
    );

    formData.append(
        "password",
        document.getElementById("register-password").value
    );

    const image = document.getElementById("register-image").files[0];

    if (image) {

        formData.append("profile_image", image);

    }

    try {
        let data;
        showLoading(registerBtn);
        try {

           data = await register(formData);

        }
        finally {

            hideLoading(registerBtn);

        }

        

        localStorage.setItem("accessToken", data.token);

        window.location.href = "index.html";

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "فشل إنشاء الحساب"
        );

    }

}

// =========================
// تبديل النوافذ
// =========================

function showRegister() {

    loginSection.classList.add("hidden");

    registerSection.classList.remove("hidden");

}

function showLogin() {

    registerSection.classList.add("hidden");

    loginSection.classList.remove("hidden");

}





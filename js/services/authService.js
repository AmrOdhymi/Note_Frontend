import axios from "https://cdn.jsdelivr.net/npm/axios@1.11.0/+esm";

const BASE_URL = "https://laravel-production-369f.up.railway.app/api";

// =========================
// Login
// =========================

export async function login(email, password) {

    const response = await axios.post(`${BASE_URL}/login`, {

        email: email,
        password: password,
        device_name: "Browser"

    });
    
    return response.data;

}

// =========================
// Register
// =========================

export async function register(formData) {

    const response = await axios.post(
        `${BASE_URL}/register`,
        formData
    );

    return response.data;

}

// =========================
// Logout
// =========================

export function logout() {

    //

}

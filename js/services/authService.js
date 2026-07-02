import axios from "https://cdn.jsdelivr.net/npm/axios@1.11.0/+esm";

export async function login(username, password) {
    const response = await axios.post('https://dummyjson.com/auth/login', {
        username: 'emilys',
        password: 'emilyspass',
        // username: username,
        // password: password,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export function logout() {
    return Promise.resolve();
}

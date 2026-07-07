import axios from "https://cdn.jsdelivr.net/npm/axios@1.11.0/+esm";

const api = axios.create({
    baseURL: "https://laravel-production-369f.up.railway.app/api",
    timeout: 10000,
    headers: {
        "Accept": "application/json"
    }
});

// إضافة التوكن قبل كل طلب
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// اعتراض جميع الاستجابات
api.interceptors.response.use(
    (response) => response,

    (error) => {

        // في حال انتهت صلاحية التوكن أو لم يعد صالحًا
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = "auth.html";
        }

        return Promise.reject(error);
    }
);

export default api;
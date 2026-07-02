import { login } from "../services/authService.js";

document.addEventListener('DOMContentLoaded', () => {
    
    const loginError = document.getElementById('login-error');
    const loginForm = document.getElementById('login-form');

    // --- معالجة إرسال نموذج تسجيل الدخول ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // القيمة المدخلة من المستخدم
        const userName = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // إخفاء رسالة الخطأ السابقة إن وجدت عند كل محاولة جديدة
        loginError.style.display = 'none';
        loginError.textContent = '';

        try {
            // إرسال الطلب عبر Axios إلى الـ API الخارجي
            const data = await login(userName, password);

            const { accessToken, username, firstName } = data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('username', username); 

            alert(`تم تسجيل الدخول بنجاح! أهلاً بك يا ${firstName}`);

            window.location.href = 'index.html'; 

        } catch (error) {
            // التعامل مع الخطأ في حال فشل تسجيل الدخول
            loginError.style.display = 'block';
            
            // إذا كان هناك رد قادم من السيرفر يحتوي على رسالة خطأ معينة
            if (error.response && error.response.data && error.response.data.message) {
                loginError.textContent = error.response.data.message;
            } else {
                // خطأ عام في حال فشل الاتصال أو عدم وجود رسالة مخصصة من السيرفر
                loginError.textContent = 'فشل تسجيل الدخول. يرجى التحقق من البيانات أو المحاولة لاحقاً.';
            }
            
            console.error('خطأ أثناء تسجيل الدخول:', error);
        }
    });
});

(function() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        window.location.href = 'auth.html';
    }
})();

function logout() {
    localStorage.clear();
    window.location.href = 'auth.html';
}
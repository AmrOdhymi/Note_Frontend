export function showLoading(button) {

    button.dataset.originalText = button.innerHTML;

    button.disabled = true;

    button.innerHTML = `
        <span class="spinner"></span>
    `;

}
export function hideLoading(button) {

    button.disabled = false;

    button.innerHTML = button.dataset.originalText;

    button.dataset.loading = "false";

}
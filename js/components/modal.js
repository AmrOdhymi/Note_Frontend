export function openModal(html) {
    const modal = document.getElementById("noteModal");
    const modalContent = document.getElementById("modalContent");
    if (modalContent) {
        modalContent.innerHTML = html;
    }
    if (modal) {
        modal.classList.add("show");
    }
}

export function closeModal() {
    const modal = document.getElementById("noteModal");
    const modalContent = document.getElementById("modalContent");
    if (modal) {
        modal.classList.remove("show");
    }
    if (modalContent) {
        modalContent.innerHTML = "";
    }
}

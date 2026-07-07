export function createNoteCard(note, actions) {
    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
        <div class="note-header">
            <h3>${note.title}</h3>
        </div>
        <div class="note-body">
            ${note.content}
        </div>
        <div class="note-tags">
            ${note.tags.map(tag => tag.name).join(", ")}
        </div>
        <div class="note-footer">
            <button class="btn open">
                <img src="assets/icon/open.svg">
            </button>
            <button class="btn edit">
                <img src="assets/icon/edit.svg">
            </button>
            <button class="btn archive">
                <img src="assets/icon/archive.svg">
            </button>
            <button class="btn delete">
                <img src="assets/icon/delete.svg">
            </button>
        </div>
    `;

    card.querySelector(".open").addEventListener("click", () => {
        actions.open(note);
    });

    card.querySelector(".edit").addEventListener("click", () => {
        actions.edit(note);
    });

    card.querySelector(".archive").addEventListener("click", () => {
        actions.archive(note);
    });

    card.querySelector(".delete").addEventListener("click", () => {
        actions.delete(note);
    });

    return card;
}

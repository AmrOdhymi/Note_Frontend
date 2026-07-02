import api from "../api.js";

export function getNotes() {
    return api.get("/notes");
}

export function createNote(data) {
    return api.post("/notes", data);
}

export function updateNote(id, data) {
    return api.put(`/notes/${id}`, data);
}

export function deleteNote(id) {
    return api.delete(`/notes/${id}`);
}

export function toggleArchive(id) {
    return api.patch(`/notes/${id}/toggleArchive`);
}
import {
    getNotArchiveNotes,
    getArchiveNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive
} from "../services/noteService.js";

import { createNoteCard } from "../components/noteCard.js";
import { openModal, closeModal } from "../components/modal.js";
import { logout } from "../services/authService.js";

const notesContainer = document.getElementById("notes");

const username = document.getElementById("user-display-name");

const userAvatarIcon = document.getElementById("user-avatar-icon");

const addNoteBtn = document.getElementById("addNoteBtn");

const refreshBtn = document.getElementById("refreshBtn");

const logoutBtn = document.getElementById("logoutBtn");

const archive = document.getElementById("archive");

const home = document.getElementById("home");

let currentPage = "home";

document.addEventListener("DOMContentLoaded", start);

async function start() {

    username.textContent = localStorage.getItem("username");

    const image = localStorage.getItem("profile_image");

    if (image && image !== "null") {
        userAvatarIcon.src = image;
    }
    

    addNoteBtn.addEventListener("click", showCreateModal);

    home.addEventListener("click", ()=>{
        archive.style.cssText = "background-color: aliceblue;"
        home.style.cssText = "background-color: #4a7c593d;"
        currentPage = "home";
        loadNotes()
    });

    archive.addEventListener("click", ()=>{
        home.style.cssText = "background-color: aliceblue;"
        archive.style.cssText = "background-color: #4a7c593d;"
        currentPage = "archive";
        loadArchiveNotes()
    });

    refreshBtn.addEventListener("click", ()=>{
        if(currentPage == "home"){
            loadNotes()
        }else{
            loadArchiveNotes()
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // logout()
            localStorage.clear();
            window.location.href = 'auth.html';
        });
    }

    await loadNotes();

}

// *************************************************************

async function loadArchiveNotes() {

    home.style.cssText = "background-color: aliceblue;"
    archive.style.cssText = "background-color: #4a7c593d;"

    const response = await getArchiveNotes();

    const archiveNotes = response.data;

    localStorage.setItem("notes", JSON.stringify(archiveNotes));

    renderNotes(archiveNotes);

}

async function loadNotes() {

    archive.style.cssText = "background-color: aliceblue;"
    home.style.cssText = "background-color: #4a7c593d;"

    const response = await getNotArchiveNotes();

    const notes = response.data;

    localStorage.setItem("notes", JSON.stringify(notes));

    renderNotes(notes);

}

function renderNotes(notes) {

    notesContainer.innerHTML = "";

    if (notes.length == 0) {

        notesContainer.innerHTML = "<p>لا توجد ملاحظات</p>";

        return;

    }

    for (const note of notes) {

        notesContainer.appendChild(
            createNoteCard(note, {
                open: showNoteModal,
                edit: showEditModal,
                archive: showArchiveModal,
                delete: showDeleteModal
            })
        );

    }

}

// *************************************************************

function showCreateModal() {

    const html = `
        <h2>إضافة ملاحظة</h2>

        <input id="title" placeholder="العنوان">

        <textarea id="content" placeholder="المحتوى"></textarea>

        <input id="tags" placeholder="tag1, tag2">

        <div class="buttons">

            <button id="saveBtn">حفظ</button>

            <button id="cancelBtn">إلغاء</button>

        </div>
    `;

    openModal(html);

    document
        .getElementById("cancelBtn")
        .addEventListener("click", closeModal);

    document
        .getElementById("saveBtn")
        .addEventListener("click", saveNewNote);

}

async function saveNewNote() {

    const title = document.getElementById("title").value;

    const content = document.getElementById("content").value;

    const tags = document
        .getElementById("tags")
        .value
        .split(".")
        .map(tag => tag.trim())
        .filter(tag => tag != "");

    const note = {

        title,
        content,
        tags

    };

    await createNote(note);

    closeModal();

    loadNotes();

}

// *************************************************************

function showEditModal(note) {

    const html = `
        <h2>تعديل الملاحظة</h2>

        <input
            id="title"
            value="${note.title}"
            placeholder="العنوان">

        <textarea
            id="content"
            placeholder="المحتوى">${note.content}</textarea>

        <input
            id="tags"
            value="${note.tags.map(tag => tag.name).join(".")}"
            placeholder="tag1, tag2">

        <div class="buttons">

            <button id="updateBtn">
                تحديث
            </button>

            <button id="cancelBtn">
                إلغاء
            </button>

        </div>
    `;

    openModal(html);

    document
        .getElementById("cancelBtn")
        .addEventListener("click", closeModal);

    document
        .getElementById("updateBtn")
        .addEventListener("click", function () {

            updateCurrentNote(note.id);

        });

}

async function updateCurrentNote(id) {

    const title = document.getElementById("title").value;

    const content = document.getElementById("content").value;

    const tags = document
        .getElementById("tags")
        .value
        .split(".")
        .map(tag => tag.trim())
        .filter(tag => tag != "");

    const newNote = {

        title,
        content,
        tags

    };

    await updateNote(id, newNote);

    closeModal();

    loadNotes();

}

// *************************************************************

function showNoteModal(note) {

    const html = `
        <h2>${note.title}</h2>

        <div class="note-view">

            <p>${note.content}</p>

        </div>

        <hr>

        <div class="note-tags">

            ${note.tags.map(tag => tag.name).join(" - ")}

        </div>

        <div class="buttons">

            <button id="closeBtn">
                إغلاق
            </button>

        </div>
    `;

    openModal(html);

    document
        .getElementById("closeBtn")
        .addEventListener("click", closeModal);

}

// *************************************************************

function showDeleteModal(note) {

    const html = `
        <h2>حذف الملاحظة</h2>

        <p>
            هل أنت متأكد من حذف الملاحظة
            <strong>"${note.title}"</strong>؟
        </p>

        <div class="buttons">

            <button id="deleteBtn">
                حذف
            </button>

            <button id="cancelBtn">
                إلغاء
            </button>

        </div>
    `;

    openModal(html);

    document
        .getElementById("cancelBtn")
        .addEventListener("click", closeModal);

    document
        .getElementById("deleteBtn")
        .addEventListener("click", function () {

            deleteCurrentNote(note.id);

        });

}


async function deleteCurrentNote(id) {

    await deleteNote(id);

    closeModal();

    loadNotes();

}

// *************************************************************

function showArchiveModal(note) {

    const message = note.archived
        ? "هل تريد إلغاء أرشفة هذه الملاحظة؟"
        : "هل تريد أرشفة هذه الملاحظة؟";

    const buttonText = note.archived
        ? "إلغاء الأرشفة"
        : "أرشفة";

    const html = `
        <h2>${buttonText}</h2>

        <p>
            ${message}
            <strong>"${note.title}"</strong>
        </p>

        <div class="buttons">

            <button id="archiveBtn">
                ${buttonText}
            </button>

            <button id="cancelBtn">
                إلغاء
            </button>

        </div>
    `;

    openModal(html);

    document
        .getElementById("cancelBtn")
        .addEventListener("click", closeModal);

    document
        .getElementById("archiveBtn")
        .addEventListener("click", function () {

            archiveCurrentNote(note.id);

        });

}

async function archiveCurrentNote(id) {

    await toggleArchive(id);

    closeModal();

    await loadNotes();

}

import {
    getNotArchiveNotes,
    getArchiveNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive
} from "../services/noteService.js";

import { hideLoading, showLoading } from "../components/loading.js"

import { createNoteCard } from "../components/noteCard.js";
import { openModal, closeModal } from "../components/modal.js";

const notesContainer = document.getElementById("notes");

const username = document.getElementById("user-display-name");

const userAvatarIcon = document.getElementById("user-avatar-icon");

const addNoteBtn = document.getElementById("addNoteBtn");

const refreshBtn = document.getElementById("refreshBtn");

const logoutBtn = document.getElementById("logoutBtn");

const archive = document.getElementById("archive");

const home = document.getElementById("home");

const searchInput = document.getElementById("searchInput");

const clearSearch = document.getElementById("clearSearch");

let currentPage = "home";

async function openHome(){
        notesContainer.innerHTML = ""
        archive.style.cssText = "background-color: aliceblue;"
        home.style.cssText = "background-color: #4a7c593d;"
        currentPage = "home";
        showLoading(home);
        try {

            await loadNotes()

        }
        finally {

            hideLoading(home);

        }
}

document.addEventListener("DOMContentLoaded", start);

    async function start() {

    searchInput.addEventListener("input", () => {

        clearSearch.hidden = searchInput.value.trim() === "";

        searchNotes();

    });

    clearSearch.addEventListener("click", () => {

        searchInput.value = "";

        clearSearch.hidden = true;

        searchInput.focus();

        searchNotes();

    });

    username.textContent = localStorage.getItem("username");

    const image = localStorage.getItem("profile_image");

    if (image && image !== "null") {
        userAvatarIcon.src = `https://laravel-production-369f.up.railway.app/storage${image}`;
    }
    

    addNoteBtn.addEventListener("click", showCreateModal);

    home.addEventListener("click", openHome);

    archive.addEventListener("click", async()=>{
        notesContainer.innerHTML = ""
        home.style.cssText = "background-color: aliceblue;"
        archive.style.cssText = "background-color: #4a7c593d;"
        currentPage = "archive";
        
        showLoading(archive);
        try {

            await loadArchiveNotes()

        }
        finally {

            hideLoading(archive);

        }
    });

    refreshBtn.addEventListener("click", async ()=>{
        notesContainer.innerHTML = ""
        showLoading(refreshBtn);
        try {

            if(currentPage == "home"){
                await loadNotes()
            }else{
                await loadArchiveNotes()
            }

        }
        finally {

            hideLoading(refreshBtn);

        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            // logout()
            localStorage.clear();
            window.location.href = 'auth.html';
        });
    }

    await openHome()

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

    notesContainer.innerHTML = ""
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

    const saveBtn = document.getElementById("saveBtn");

    showLoading(saveBtn);
    try{
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
    finally {

        hideLoading(saveBtn);

    }

    

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

    const updateBtn = document.getElementById("updateBtn");

    showLoading(updateBtn);

    try{
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

    finally {

        hideLoading(updateBtn);

    }

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

    const deleteBtn = document.getElementById("deleteBtn");

    showLoading(deleteBtn);

    try {

        await deleteNote(id);

        closeModal();

        await loadNotes();

    }
    finally {

        hideLoading(deleteBtn);

    }

}

// *************************************************************

function showArchiveModal(note) {

    const message = note.is_archived
        ? "هل تريد إلغاء أرشفة هذه الملاحظة؟"
        : "هل تريد أرشفة هذه الملاحظة؟";

    const buttonText = note.is_archived
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

    const archiveBtn = document.getElementById("archiveBtn");

    showLoading(archiveBtn);

    try {

        await toggleArchive(id);

        closeModal();

        await loadNotes();

    }
    finally {

        hideLoading(archiveBtn);

    }

}


// *************************************************************

function searchNotes(){

    const keyword = searchInput.value.trim().toLowerCase();

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    if(keyword === ""){

        renderNotes(notes);

        return;

    }

    const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(keyword)
    );

    renderNotes(filtered);

}
console.log("NoEtra JavaScript Loaded");

/* =========================================================
   API
========================================================= */

const API = "http://localhost:3000/api";


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getToken() {
    return localStorage.getItem("token");
}


function getUser() {
    const user = localStorage.getItem("user");

    if (user) {
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error("User data error:", error);
        }
    }

    const oldUser = localStorage.getItem("noetraUser");

    if (oldUser) {
        try {
            return JSON.parse(oldUser);
        } catch (error) {
            console.error("Old user data error:", error);
        }
    }

    return null;
}

function authHeaders() {

    const token = getToken();

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       HAMBURGER MENU
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const sideMenu = document.getElementById("sideMenu");
    const closeMenu = document.getElementById("closeMenu");
    const menuOverlay = document.getElementById("menuOverlay");

    if (menuToggle && sideMenu) {

        menuToggle.addEventListener("click", function () {

            sideMenu.classList.add("active");

            if (menuOverlay) {
                menuOverlay.classList.add("active");
            }

        });

    }


    if (closeMenu && sideMenu) {

        closeMenu.addEventListener("click", function () {

            sideMenu.classList.remove("active");

            if (menuOverlay) {
                menuOverlay.classList.remove("active");
            }

        });

    }


    if (menuOverlay && sideMenu) {

        menuOverlay.addEventListener("click", function () {

            sideMenu.classList.remove("active");
            menuOverlay.classList.remove("active");

        });

    }


    if (sideMenu) {

        const menuLinks = sideMenu.querySelectorAll("a");

        menuLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                sideMenu.classList.remove("active");

                if (menuOverlay) {
                    menuOverlay.classList.remove("active");
                }

            });

        });

    }


    /* =====================================================
       DASHBOARD CARD NAVIGATION
    ===================================================== */

    const options = document.querySelectorAll(".option");

    options.forEach(function (option) {

        option.addEventListener("click", function () {

            const page = this.getAttribute("data-page");

            if (page) {
                window.location.href = page;
            }

        });

    });


    /* =====================================================
       THEME BUTTON
    ===================================================== */

    const themeBtn = document.getElementById("themeBtn");

    if (themeBtn) {

        const savedTheme =
            localStorage.getItem("noetraTheme");

        if (savedTheme === "dark") {

            document.body.classList.add("dark");

            themeBtn.textContent = "☀️ Light";

        }


        themeBtn.addEventListener("click", function () {

            document.body.classList.toggle("dark");

            const isDark =
                document.body.classList.contains("dark");

            if (isDark) {

                localStorage.setItem(
                    "noetraTheme",
                    "dark"
                );

                themeBtn.textContent =
                    "☀️ Light";

            } else {

                localStorage.setItem(
                    "noetraTheme",
                    "light"
                );

                themeBtn.textContent =
                    "🌙 Dark";

            }

        });

    }


    /* =====================================================
   DASHBOARD USER NAME
===================================================== */

const userName =
    document.getElementById("userName");

const profileUserName =
    document.getElementById("profileUserName");

const navbarUsername =
    document.getElementById("navbarUsername");

const user =
    getUser();


if (user) {

    const name =
        user.full_name ||
        user.username ||
        user.name ||
        user.email ||
        "User";


    if (userName) {
        userName.textContent = name;
    }


    if (profileUserName) {
        profileUserName.textContent = name;
    }


    if (navbarUsername) {
        navbarUsername.textContent = name;
    }

}


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                logout();

            }
        );

    }


    /* =====================================================
       SEARCH BUTTON
    ===================================================== */

    const searchBtn =
        document.getElementById("searchBtn");

    const searchInput =
        document.getElementById("searchInput");

    if (searchBtn && searchInput) {

        searchBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                performSearch();

            }
        );


        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performSearch();

                }

            }
        );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }


    /* =====================================================
       REGISTER
    ===================================================== */

    const registerForm =
        document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            handleRegister
        );

    }


    /* =====================================================
       PROFILE
    ===================================================== */

    loadProfile();


    const profileForm =
        document.getElementById("profileForm");

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            handleProfileUpdate
        );

    }


    /* =====================================================
       NOTES
    ===================================================== */

    const saveNoteBtn =
        document.getElementById("saveNoteBtn");

    const noteInput =
        document.getElementById("noteInput");

    if (saveNoteBtn && noteInput) {

        saveNoteBtn.addEventListener(
            "click",
            saveNote
        );

    }

    loadNotes();


    /* =====================================================
       BOOKMARKS
    ===================================================== */

    loadBookmarks();


    /* =====================================================
       PROGRESS
    ===================================================== */

    const progressBtn =
        document.getElementById("progressBtn");

    if (progressBtn) {

        progressBtn.addEventListener(
            "click",
            updateProgress
        );

    }

    loadProgress();


    /* =====================================================
       LEARNING LEVEL
    ===================================================== */

    setupLearningLevels();


    /* =====================================================
       POPULAR TOPICS
    ===================================================== */

    setupPopularTopics();


    /* =====================================================
       LEARNING RESOURCES
    ===================================================== */

    setupLearningResources();


    /* =====================================================
       COMMUNITY
    ===================================================== */

    const postForm =
        document.getElementById("postForm");

    if (postForm) {

        postForm.addEventListener(
            "submit",
            createCommunityPost
        );

    }

    loadCommunityDiscussions();


    /* =====================================================
       QUIZ
    ===================================================== */

    loadQuizzes();


    /* =====================================================
       ROLE-BASED DASHBOARD (Admin Panel card + role badge)
    ===================================================== */

    applyRoleBasedUI();
    applyHomeAdminUI();

});


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(text, type = "") {

    const message =
        document.getElementById("message");

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className = type;

}


/* =========================================================
   LOGIN
========================================================= */

async function handleLogin(event) {

    event.preventDefault();

    const email =
        document.getElementById("email")?.value.trim().toLowerCase();

    const password =
        document.getElementById("password")?.value;


    if (!email || !password) {

        showMessage(
            "Please fill in all fields.",
            "error"
        );

        return;

    }


    const loginBtn =
        document.getElementById("loginBtn");


    if (loginBtn) {

        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";

    }


    try {

        const response =
            await fetch(
                `${API}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.error ||
                "Login failed.",
                "error"
            );

            if (loginBtn) {

                loginBtn.disabled = false;
                loginBtn.textContent = "Login";

            }

            return;

        }


        localStorage.setItem(
            "token",
            data.token
        );


        let user = {
            email: email,
            role: data.role
        };


        try {

            const profileResponse =
                await fetch(
                    `${API}/profile`,
                    {
                        headers: {
                            "Authorization":
                                `Bearer ${data.token}`
                        }
                    }
                );

            if (profileResponse.ok) {

                const profileData =
                    await profileResponse.json();

                user = profileData;

            }

        } catch (profileError) {

            console.error(
                "Could not load profile:",
                profileError
            );

        }


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        showMessage(
            "Login successful! 🎉",
            "success"
        );


        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 700);


    } catch (error) {

        console.error(error);

        showMessage(
            "Backend server is not connected.",
            "error"
        );

        if (loginBtn) {

            loginBtn.disabled = false;
            loginBtn.textContent = "Login";

        }

    }

}


/* =========================================================
   REGISTER
========================================================= */

async function handleRegister(event) {

    event.preventDefault();


    const fullNameElement =
        document.getElementById("full_name") ||
        document.getElementById("fullName");

    const usernameElement =
        document.getElementById("username");

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");


    if (
        !fullNameElement ||
        !usernameElement ||
        !emailElement ||
        !passwordElement
    ) {

        console.error(
            "Register form IDs do not match."
        );

        return;

    }


    const full_name =
        fullNameElement.value.trim();

    const username =
        usernameElement.value.trim();

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    try {

        const response =
            await fetch(
                `${API}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        full_name,
                        username,
                        email,
                        password
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.error ||
                "Registration failed.",
                "error"
            );

            return;

        }


        showMessage(
            "Registration successful! Please login.",
            "success"
        );


        setTimeout(function () {

            window.location.href =
                "login.html";

        }, 1000);


    } catch (error) {

        console.error(error);

        showMessage(
            "Backend server is not connected.",
            "error"
        );

    }

}


/* =========================================================
   PROFILE
========================================================= */

async function loadProfile() {

    const profileName =
        document.getElementById("profileName");

    const profileUsername =
        document.getElementById("profileUsername");

    const profileEmail =
        document.getElementById("profileEmail");


    if (
        !profileName &&
        !profileUsername &&
        !profileEmail
    ) {

        return;

    }


    if (!getToken()) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/profile`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logout();

            return;

        }


        const profile =
            await response.json();


        if (profileName) {
            profileName.textContent =
                profile.full_name || "User";
        }


        if (profileUsername) {
            profileUsername.textContent =
                profile.username || "";
        }


        if (profileEmail) {
            profileEmail.textContent =
                profile.email || "";
        }


        localStorage.setItem(
            "user",
            JSON.stringify(profile)
        );


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


/* =========================================================
   UPDATE PROFILE
========================================================= */

async function handleProfileUpdate(event) {

    event.preventDefault();


    const full_name =
        document.getElementById(
            "full_name"
        )?.value.trim();

    const username =
        document.getElementById(
            "username"
        )?.value.trim();

    const email =
        document.getElementById(
            "email"
        )?.value.trim();


    try {

        const response =
            await fetch(
                `${API}/profile`,
                {

                    method: "PUT",

                    headers:
                        authHeaders(),

                    body:
                        JSON.stringify({
                            full_name,
                            username,
                            email
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.error ||
                "Profile update failed.",
                "error"
            );

            return;

        }


        const oldUser =
            getUser() || {};


        localStorage.setItem(
            "user",
            JSON.stringify({
                ...oldUser,
                ...data
            })
        );


        showMessage(
            "Profile updated successfully!",
            "success"
        );


    } catch (error) {

        console.error(error);

        showMessage(
            "Could not connect to backend.",
            "error"
        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    localStorage.removeItem("noetraUser");

    window.location.href =
        "login.html";

}


/* =========================================================
   NAVIGATION
========================================================= */

function openPage(page) {

    window.location.href = page;

}


function goDashboard() {

    window.location.href =
        "dashboard.html";

}


function goRegister() {

    window.location.href =
        "register.html";

}


function forgotPassword() {

    window.location.href =
        "forgot-password.html";

}


async function performSearch() {

    const searchInput =
        document.getElementById("searchInput");

    const searchResult =
        document.getElementById("searchResult");

    const resourceContainer =
        document.getElementById("resourceContainer");


    if (!searchInput || !searchResult) {
        return;
    }


    const topic =
        searchInput.value.trim();


    if (!topic) {

        searchResult.innerHTML = `

            <div class="search-message">

                <p>
                    Please enter a topic to search.
                </p>

            </div>

        `;

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/search?q=${encodeURIComponent(topic)}`
            );


        const data =
            await response.json();


        console.log("SEARCH RESPONSE:", data);
        console.log("SEARCH STATUS:", response.status);


        if (!response.ok) {

            searchResult.innerHTML = `

                <div class="search-message">

                    <p>
                        ${
                            escapeHTML(
                                data.error ||
                                "Search failed."
                            )
                        }
                    </p>

                </div>

            `;

            return;

        }


        /* =====================================================
           SEARCH RESULT
        ===================================================== */

        let html = "";


        if (
            data.topics &&
            data.topics.length
        ) {

            const uniqueTopics =
                data.topics.filter(
                    function (item, index, self) {

                        return index ===
                            self.findIndex(
                                function (t) {

                                    return t.topic_name?.toLowerCase() ===
                                        item.topic_name?.toLowerCase();

                                }
                            );

                    }
                );


            uniqueTopics.forEach(
                function (item) {

                    html += `

                        <div class="search-result-card">

                            <h2>
                                ${
                                    escapeHTML(
                                        item.topic_name
                                    )
                                }
                            </h2>

                            <button
                                onclick="generateRoadmap(${item.result_id})"
                            >
                                View Roadmap
                            </button>

                        </div>

                    `;

                }
            );

        }


        if (!html) {

            html = `

                <div class="search-message">

                    <h3>
                        No Result Found
                    </h3>

                    <p>
                        No roadmap or resource matched your search.
                    </p>

                </div>

            `;

        }


        searchResult.innerHTML =
            html;


        /* =====================================================
           LEARNING RESOURCES
        ===================================================== */

        if (
            resourceContainer &&
            data.resources &&
            data.resources.length
        ) {

            resourceContainer.innerHTML =
                data.resources.map(
                    function (resource) {

                        return `

                            <div class="resource-card">

                                <h3>
                                    ${
                                        escapeHTML(
                                            resource.resource_title
                                        )
                                    }
                                </h3>

                                <p>
                                    ${
                                        escapeHTML(
                                            resource.resource_type
                                        )
                                    }
                                </p>

                                <a
                                    href="${escapeHTML(
                                        resource.resource_link
                                    )}"
                                    target="_blank"
                                >
                                    Open Resource
                                </a>

                            </div>

                        `;

                    }
                ).join("");

        }


    } catch (error) {

        console.error(error);

        searchResult.innerHTML = `

            <div class="search-message">

                <p>
                    Could not connect to backend.
                </p>

            </div>

        `;

    }

}
//Roadmap
function generateRoadmap(resultId) {

    window.location.href = "roadmap.html";

}

/* =========================================================
   BOOKMARK
========================================================= */

async function bookmarkResource(resourceId) {

    if (!getToken()) {

        alert("Please login first.");

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/bookmarks`,
                {

                    method: "POST",

                    headers:
                        authHeaders(),

                    body:
                        JSON.stringify({
                            resourceId
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Could not bookmark resource."
            );

            return;

        }


        alert(
            "Resource bookmarked successfully!"
        );


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to backend."
        );

    }

}


/* =========================================================
   LOAD BOOKMARKS
========================================================= */

async function loadBookmarks() {

    const bookmarkList =
        document.getElementById(
            "bookmarkList"
        );


    if (!bookmarkList) {
        return;
    }


    if (!getToken()) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/bookmarks`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            bookmarkList.textContent =
                data.error ||
                "Could not load bookmarks.";

            return;

        }


        if (!data.length) {

            bookmarkList.textContent =
                "No bookmarks yet.";

            return;

        }


        bookmarkList.innerHTML =
            data.map(function (bookmark) {

                return `

                    <div class="resource-card">

                        <h3>
                            ${
                                escapeHTML(
                                    bookmark.resource_title
                                )
                            }
                        </h3>

                        <p>
                            ${
                                escapeHTML(
                                    bookmark.resource_type
                                )
                            }
                        </p>

                        <a
                            href="${escapeHTML(
                                bookmark.resource_link
                            )}"
                            target="_blank"
                        >
                            Open Resource
                        </a>

                        <button
                            onclick="removeBookmark(${bookmark.bookmark_id})"
                        >
                            Remove
                        </button>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

        bookmarkList.textContent =
            "Could not connect to backend.";

    }

}


/* =========================================================
   REMOVE BOOKMARK
========================================================= */

async function removeBookmark(bookmarkId) {

    try {

        const response =
            await fetch(
                `${API}/bookmarks/${bookmarkId}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Could not remove bookmark."
            );

            return;

        }


        loadBookmarks();


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to backend."
        );

    }

}


/* =========================================================
   NOTES
========================================================= */

async function saveNote() {

    const noteInput =
        document.getElementById(
            "noteInput"
        );


    if (!noteInput) {
        return;
    }


    const note =
        noteInput.value.trim();


    if (!note) {

        alert(
            "Please write a note first."
        );

        return;

    }


    if (!getToken()) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/notes`,
                {

                    method: "POST",

                    headers:
                        authHeaders(),

                    body:
                        JSON.stringify({

                            topic: "General",

                            content: note

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Could not save note."
            );

            return;

        }


        noteInput.value = "";

        loadNotes();


        alert(
            "Note saved successfully!"
        );


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to backend."
        );

    }

}


/* =========================================================
   LOAD NOTES
========================================================= */

async function loadNotes() {

    const list =
        document.getElementById(
            "notesList"
        );


    if (!list || !getToken()) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/notes`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {
            return;
        }


        if (!data.length) {

            list.innerHTML =
                "<p>No notes yet.</p>";

            return;

        }


        list.innerHTML =
            data.map(function (note) {

                return `

                    <div class="note-card">

                        <p>
                            ${
                                escapeHTML(
                                    note.note
                                )
                            }
                        </p>

                        <button
                            onclick="deleteNote(${note.note_id})"
                        >
                            Delete
                        </button>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "Notes loading error:",
            error
        );

    }

}


/* =========================================================
   DELETE NOTE
========================================================= */

async function deleteNote(noteId) {

    try {

        const response =
            await fetch(
                `${API}/notes/${noteId}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Could not delete note."
            );

            return;

        }


        loadNotes();


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   PROGRESS
========================================================= */

async function updateProgress() {

    const progressBtn =
        document.getElementById(
            "progressBtn"
        );


    if (!progressBtn) {
        return;
    }


    const topic =
        progressBtn.dataset.topic ||
        "General";


    try {

        const response =
            await fetch(
                `${API}/progress`,
                {

                    method: "POST",

                    headers:
                        authHeaders(),

                    body:
                        JSON.stringify({
                            topic
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Could not update progress."
            );

            return;

        }


        const progressBar =
            document.getElementById(
                "progressBar"
            );


        if (progressBar) {
            progressBar.value = 100;
        }


        alert(
            "Topic marked as completed!"
        );


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to backend."
        );

    }

}


/* =========================================================
   LOAD PROGRESS
========================================================= */

async function loadProgress() {

    const bar =
        document.getElementById(
            "progressBar"
        );

    const text =
        document.getElementById(
            "progressText"
        );


    if (!bar && !text) {
        return;
    }


    if (!getToken()) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/progress`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {
            return;
        }


        const percentage =
            data.progressPercentage || 0;


        if (bar) {
            bar.value = percentage;
        }


        if (text) {
            text.textContent =
                `${percentage}%`;
        }


    } catch (error) {

        console.error(
            "Progress error:",
            error
        );

    }

}


/* =========================================================
   LEARNING LEVEL
========================================================= */

function setupLearningLevels() {

    const levelButtons =
        document.querySelectorAll(
            ".level-btn"
        );

    const levelResult =
        document.getElementById(
            "levelResult"
        );


    if (
        !levelButtons.length ||
        !levelResult
    ) {

        return;

    }


    levelButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                levelButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add("active");


                const level =
                    this.dataset.level;


                let content = "";


                if (level === "Beginner") {

                    content = `

                        <div class="level-result-card">

                            <h3>
                                Beginner Level
                            </h3>

                            <p>
                                Start with the basics
                                and build a strong foundation.
                            </p>

                            <ul>

                                <li>
                                    Learn basic concepts
                                </li>

                                <li>
                                    Follow beginner-friendly resources
                                </li>

                                <li>
                                    Practice simple exercises
                                </li>

                            </ul>

                        </div>

                    `;

                }


                else if (level === "Intermediate") {

                    content = `

                        <div class="level-result-card">

                            <h3>
                                Intermediate Level
                            </h3>

                            <p>
                                Improve your skills through
                                practical learning.
                            </p>

                            <ul>

                                <li>
                                    Learn intermediate concepts
                                </li>

                                <li>
                                    Work on practical examples
                                </li>

                                <li>
                                    Build small projects
                                </li>

                            </ul>

                        </div>

                    `;

                }


                else if (level === "Advanced") {

                    content = `

                        <div class="level-result-card">

                            <h3>
                                Advanced Level
                            </h3>

                            <p>
                                Explore advanced concepts
                                and real-world projects.
                            </p>

                            <ul>

                                <li>
                                    Study advanced concepts
                                </li>

                                <li>
                                    Work on complex projects
                                </li>

                                <li>
                                    Explore real-world applications
                                </li>

                            </ul>

                        </div>

                    `;

                }


                levelResult.innerHTML =
                    content;

            }
        );

    });

}


/* =========================================================
   POPULAR TOPICS
========================================================= */

async function setupPopularTopics() {

    const popularTopics =
        document.getElementById("popularTopics");


    if (!popularTopics) {
        return;
    }


    try {

        const response =
            await fetch(`${API}/results`);


        const data =
            await response.json();


        if (!response.ok || !data.length) {

            popularTopics.innerHTML = `

                <p>
                    No topics available yet.
                </p>

            `;

            return;

        }


        /* Shuffle topics randomly */

        const shuffled =
            data.sort(function () {

                return Math.random() - 0.5;

            });


        /* Pick 2 or 3 topics */

        const topics =
            shuffled.slice(
                0,
                Math.min(3, shuffled.length)
            );


        popularTopics.innerHTML =
            topics.map(function (topic) {

                return `

                    <div class="card">

                        <h3>
                            ${
                                escapeHTML(
                                    topic.topic_name
                                )
                            }
                        </h3>

                        <p>
                            Difficulty:
                            ${
                                escapeHTML(
                                    topic.difficulty ||
                                    "Beginner"
                                )
                            }
                        </p>

                        <button
                            onclick="generateRoadmap(${topic.result_id})"
                        >
                            View Roadmap
                        </button>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

        popularTopics.innerHTML = `

            <p>
                Could not load topics.
            </p>

        `;

    }

}
/* =========================================================
   LEARNING RESOURCES
========================================================= */

function setupLearningResources() {

    const resourceButtons =
        document.querySelectorAll(
            ".resource-btn"
        );

    const resourceResult =
        document.getElementById(
            "resourceResult"
        );


    if (
        !resourceButtons.length ||
        !resourceResult
    ) {

        return;

    }


    resourceButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const resourceName =
                    this.getAttribute(
                        "data-resource"
                    );


                resourceResult.innerHTML = `

                    <div class="resource-result-card">

                        <h3>
                            ${
                                escapeHTML(
                                    resourceName
                                )
                            }
                        </h3>

                        <p>
                            Resources for
                            ${
                                escapeHTML(
                                    resourceName
                                )
                            }
                            will be available soon.
                        </p>

                    </div>

                `;

            }
        );

    });

}



/* =========================================================
   COMMUNITY POST
========================================================= */

async function createCommunityPost(event) {

    event.preventDefault();


    const savedUser =
        localStorage.getItem(
            "noetraUser"
        );


    if (!savedUser) {

        showCommunityMessage(
            "Please login first.",
            "error"
        );

        return;

    }


    let user;


    try {

        user =
            JSON.parse(savedUser);

    } catch (error) {

        showCommunityMessage(
            "Please login again.",
            "error"
        );

        return;

    }


    const title =
        document.getElementById(
            "title"
        )?.value.trim();


    const content =
        document.getElementById(
            "content"
        )?.value.trim();


    if (!title) {

        showCommunityMessage(
            "Please enter a discussion title.",
            "error"
        );

        return;

    }


    if (!content) {

        showCommunityMessage(
            "Please write something in your discussion.",
            "error"
        );

        return;

    }


    const posts =
        getLocalDiscussions();


    posts.unshift({

        post_id:
            Date.now(),

        title:
            title,

        content:
            content,

        username:
            user.name ||
            user.username ||
            user.email ||
            "User",

        created_at:
            new Date().toISOString()

    });


    saveLocalDiscussions(posts);


    showCommunityMessage(
        "Discussion posted successfully!",
        "success"
    );


    event.target.reset();


    loadCommunityDiscussions();

}


/* =========================================================
   LOAD COMMUNITY
========================================================= */

function loadCommunityDiscussions() {

    const list =
        document.getElementById(
            "discussionList"
        );


    if (!list) {
        return;
    }


    const discussions =
        getLocalDiscussions();


    if (!discussions.length) {

        list.innerHTML = `

            <div class="community-card">

                <h3>
                    💬 No discussions yet
                </h3>

                <p>
                    Be the first person to start a discussion!
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    discussions.forEach(function (post) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "community-card";


        card.innerHTML = `

            <h3>
                ${
                    escapeHTML(
                        post.title
                    )
                }
            </h3>

            <p>
                ${
                    escapeHTML(
                        post.content
                    )
                }
            </p>

            <small>
                👤 Posted by:
                <strong>
                    ${
                        escapeHTML(
                            post.username ||
                            "User"
                        )
                    }
                </strong>
            </small>

            <br>

            <small>
                🕒
                ${
                    formatDate(
                        post.created_at
                    )
                }
            </small>

        `;


        list.appendChild(card);

    });

}

/* =========================================================
   COMMUNITY POST — now saved to the backend, not localStorage
========================================================= */

async function createCommunityPost(event) {

    event.preventDefault();

    if (!getToken()) {
        showCommunityMessage("Please login first.", "error");
        return;
    }

    const title = document.getElementById("title")?.value.trim();
    const content = document.getElementById("content")?.value.trim();

    if (!title) {
        showCommunityMessage("Please enter a discussion title.", "error");
        return;
    }

    if (!content) {
        showCommunityMessage("Please write something in your discussion.", "error");
        return;
    }

    try {

        const response = await fetch(`${API}/community-discussions`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ title, content })
        });

        const data = await response.json();

        if (!response.ok) {
            showCommunityMessage(data.error || "Could not post discussion.", "error");
            return;
        }

        showCommunityMessage("Discussion posted successfully!", "success");

        event.target.reset();

        loadCommunityDiscussions();

    } catch (error) {

        console.error(error);
        showCommunityMessage("Could not connect to backend.", "error");

    }

}


/* =========================================================
   LOAD COMMUNITY
========================================================= */

async function loadCommunityDiscussions() {

    const list = document.getElementById("discussionList");

    if (!list) {
        return;
    }

    try {

        const response = await fetch(`${API}/community-discussions`);
        const discussions = await response.json();

        if (!response.ok || !discussions.length) {

            list.innerHTML = `
                <div class="community-card">
                    <h3>💬 No discussions yet</h3>
                    <p>Be the first person to start a discussion!</p>
                </div>
            `;

            return;

        }

        list.innerHTML = "";

        discussions.forEach(function (post) {

            const card = document.createElement("div");
            card.className = "community-card";

            card.innerHTML = `
                <h3>${escapeHTML(post.title)}</h3>
                <p>${escapeHTML(post.content)}</p>
                <small>👤 Posted by: <strong>${escapeHTML(post.username || "User")}</strong></small>
                <br>
                <small>🕒 ${formatDate(post.created_at)}</small>
            `;

            list.appendChild(card);

        });

    } catch (error) {

        console.error("Load community error:", error);

        list.innerHTML = `
            <div class="community-card">
                <p>Could not connect to backend.</p>
            </div>
        `;

    }

}

/* =========================================================
   COMMUNITY MESSAGE
========================================================= */

function showCommunityMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "message"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        "community-message " +
        (type || "");

}


/* =========================================================
   QUIZ
========================================================= */

async function loadQuizzes() {

    const quizList =
        document.getElementById(
            "quizList"
        );


    if (!quizList) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/quizzes`
            );


        const quizzes =
            await response.json();


        if (!response.ok) {
            return;
        }


        if (!quizzes.length) {

            quizList.innerHTML =
                "<p>No quizzes available.</p>";

            return;

        }


        quizList.innerHTML =
            quizzes.map(function (quiz) {

                return `

                    <div class="quiz-card">

                        <h3>
                            ${
                                escapeHTML(
                                    quiz.quiz_title
                                )
                            }
                        </h3>

                        <p>
                            ${
                                escapeHTML(
                                    quiz.description ||
                                    ""
                                )
                            }
                        </p>

                        <button
                            onclick="startBackendQuiz(${quiz.quiz_id})"
                        >
                            Start Quiz
                        </button>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "Quiz loading error:",
            error
        );

    }

}


/* =========================================================
   START QUIZ
========================================================= */

async function startBackendQuiz(quizId) {

    const quizArea =
        document.getElementById(
            "quizArea"
        );


    if (!quizArea) {
        return;
    }


    if (!getToken()) {

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/quizzes/${quizId}`,
                {

                    method: "GET",

                    headers:
                        authHeaders()

                }
            );


        const quiz =
            await response.json();


        if (!response.ok) {

            quizArea.innerHTML =
                `<p>${escapeHTML(
                    quiz.error ||
                    "Could not load quiz."
                )}</p>`;

            return;

        }


        if (
            !quiz.questions ||
            !quiz.questions.length
        ) {

            quizArea.innerHTML =
                "<p>This quiz has no questions yet.</p>";

            return;

        }


        let currentQuestion = 0;

        const answers = [];


        function showQuestion() {

            const question =
                quiz.questions[
                    currentQuestion
                ];


            quizArea.innerHTML = `

                <div class="quiz-question-card">

                    <h2>
                        ${
                            escapeHTML(
                                quiz.quiz_title
                            )
                        }
                    </h2>

                    <p>
                        Question
                        ${
                            currentQuestion + 1
                        }
                        of
                        ${
                            quiz.questions.length
                        }
                    </p>

                    <h3>
                        ${
                            escapeHTML(
                                question.question_text
                            )
                        }
                    </h3>

                    <label>

                        <input
                            type="radio"
                            name="backendQuizAnswer"
                            value="A"
                        >

                        ${
                            escapeHTML(
                                question.option_a
                            )
                        }

                    </label>

                    <br>

                    <label>

                        <input
                            type="radio"
                            name="backendQuizAnswer"
                            value="B"
                        >

                        ${
                            escapeHTML(
                                question.option_b
                            )
                        }

                    </label>

                    <br>

                    <label>

                        <input
                            type="radio"
                            name="backendQuizAnswer"
                            value="C"
                        >

                        ${
                            escapeHTML(
                                question.option_c
                            )
                        }

                    </label>

                    <br>

                    <label>

                        <input
                            type="radio"
                            name="backendQuizAnswer"
                            value="D"
                        >

                        ${
                            escapeHTML(
                                question.option_d
                            )
                        }

                    </label>

                    <br><br>

                    <button
                        id="backendNextQuestion"
                        type="button"
                    >

                        ${
                            currentQuestion ===
                            quiz.questions.length - 1
                                ? "Submit Quiz"
                                : "Next"
                        }

                    </button>

                    <p
                        id="backendQuizMessage"
                    ></p>

                </div>

            `;


            const nextButton =
                document.getElementById(
                    "backendNextQuestion"
                );


            nextButton.addEventListener(
                "click",
                async function () {

                    const selected =
                        document.querySelector(
                            'input[name="backendQuizAnswer"]:checked'
                        );


                    const message =
                        document.getElementById(
                            "backendQuizMessage"
                        );


                    if (!selected) {

                        message.textContent =
                            "Please select an answer.";

                        return;

                    }


                    answers.push({

                        question_id:
                            question.question_id,

                        selected_option:
                            selected.value

                    });


                    currentQuestion++;


                    if (
                        currentQuestion <
                        quiz.questions.length
                    ) {

                        showQuestion();

                    } else {

                        await submitBackendQuiz();

                    }

                }
            );

        }


        async function submitBackendQuiz() {

            try {

                const response =
                    await fetch(
                        `${API}/quizzes/${quizId}/submit`,
                        {

                            method: "POST",

                            headers:
                                authHeaders(),

                            body:
                                JSON.stringify({
                                    answers
                                })

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    quizArea.innerHTML =
                        `<p>${escapeHTML(
                            result.error ||
                            "Quiz submission failed."
                        )}</p>`;

                    return;

                }


                quizArea.innerHTML = `

                    <div class="quiz-question-card">

                        <h2>
                            Quiz Completed! 🎉
                        </h2>

                        <p>
                            Score:
                            <strong>
                                ${
                                    result.score
                                }
                            </strong>
                            /
                            <strong>
                                ${
                                    result.totalQuestions
                                }
                            </strong>
                        </p>

                        <p>
                            Percentage:
                            <strong>
                                ${
                                    result.percentage
                                }%
                            </strong>
                        </p>

                    </div>

                `;


            } catch (error) {

                console.error(error);

                quizArea.innerHTML =
                    "<p>Could not connect to backend.</p>";

            }

        }


        showQuestion();


    } catch (error) {

        console.error(error);

        quizArea.innerHTML =
            "<p>Could not connect to backend.</p>";

    }

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

async function submitForgotPassword() {

    const emailInput =
        document.getElementById(
            "email"
        );

    const message =
        document.getElementById(
            "message"
        );


    if (!emailInput) {
        return;
    }


    const email =
        emailInput.value.trim();


    if (!email) {

        if (message) {
            message.textContent =
                "Please enter your email.";
        }

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/forgot-password`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            email
                        })

                }
            );


        const data =
            await response.json();


        if (message) {

            message.textContent =
                data.message ||
                "If that email exists, a reset link has been sent.";

        }


    } catch (error) {

        console.error(error);

        if (message) {

            message.textContent =
                "Could not connect to backend.";

        }

    }

}


/* =========================================================
   RESET PASSWORD
========================================================= */

async function submitResetPassword() {

    const passwordInput =
        document.getElementById(
            "newPassword"
        );

    const message =
        document.getElementById(
            "message"
        );


    const params =
        new URLSearchParams(
            window.location.search
        );


    const token =
        params.get("token");


    if (!token) {

        if (message) {

            message.textContent =
                "Invalid reset token.";

        }

        return;

    }


    const newPassword =
        passwordInput?.value;


    if (!newPassword) {

        if (message) {

            message.textContent =
                "Please enter a new password.";

        }

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/reset-password`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            token,

                            newPassword

                        })

                }
            );


        const data =
            await response.json();


        if (message) {

            message.textContent =
                data.message ||
                data.error ||
                "Password reset completed.";

        }


    } catch (error) {

        console.error(error);

        if (message) {

            message.textContent =
                "Could not connect to backend.";

        }

    }

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Recently";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Recently";

    }


    return date.toLocaleString();

}


/* =========================================================
   ROLE-BASED UI
   (Admin Panel card + role badge on dashboard.html,
   Admin <-> Profile swap in the nav, admin.html guard)
========================================================= */

function applyRoleBasedUI() {

    const user = getUser();
    const isAdmin = !!(user && user.role === "admin");

    // --- Nav: swap "Admin" link to "Profile" for non-admins ---

    const navLinks = document.querySelectorAll(".side-menu-links a, nav .menu a");
    let adminNavLink = null;

    navLinks.forEach(function (link) {
        if (link.getAttribute("href") === "admin.html") {
            adminNavLink = link;
        }
    });

    if (adminNavLink) {

        if (isAdmin) {
            // leave as-is
        } else if (user) {
            adminNavLink.textContent = "👤 Profile";
            adminNavLink.setAttribute("href", "profile.html");
        } else {
            adminNavLink.style.display = "none";
        }

    }

    // --- Guard: kick non-admins off admin.html ---

    const onAdminPage = window.location.pathname.endsWith("admin.html");

    if (onAdminPage && !isAdmin) {
        window.location.href = user ? "dashboard.html" : "login.html";
        return;
    }

    // --- Dashboard: Admin Panel card + role badge ---

    const adminPanelOption = document.getElementById("adminPanelOption");
    const roleBadge = document.getElementById("roleBadge");

    if (adminPanelOption && isAdmin) {
        adminPanelOption.style.display = "flex";
    }

    if (roleBadge && isAdmin) {
        roleBadge.textContent = "⚙️ Admin";
        roleBadge.style.cssText =
            "font-size:14px; background:#eee3f2; color:#4b1f5f; padding:4px 10px; border-radius:20px; margin-left:8px; vertical-align:middle;";
    }

    // --- Dashboard: swap the student "Explore" grid for an admin management grid ---

    const exploreSection = document.querySelector(".dashboard-explore");

    if (exploreSection && isAdmin) {

        exploreSection.innerHTML = `
            <h2>Admin Dashboard</h2>
            <div class="option-grid">

                <div class="option" data-page="admin.html#section-resources">
                    <span>📚</span>
                    <h3>Manage Resources</h3>
                    <p>Edit or remove learning resources</p>
                </div>

                <div class="option" data-page="admin.html#section-users">
                    <span>👥</span>
                    <h3>Manage Users</h3>
                    <p>View registered users</p>
                </div>

                <div class="option" data-page="admin.html#section-community">
                    <span>💬</span>
                    <h3>Manage Community</h3>
                    <p>Moderate discussions</p>
                </div>

                <div class="option" data-page="admin.html#section-create-topic">
                    <span>🗺️</span>
                    <h3>Create Topic</h3>
                    <p>Add a new roadmap</p>
                </div>

                <div class="option" data-page="admin.html#section-create-resource">
                    <span>📎</span>
                    <h3>Add Resource</h3>
                    <p>Attach a resource to a topic</p>
                </div>

                <div class="option" data-page="admin.html#section-create-quiz">
                    <span>🧠</span>
                    <h3>Create Quiz</h3>
                    <p>Start a new quiz</p>
                </div>

                <div class="option" data-page="admin.html#section-create-question">
                    <span>❓</span>
                    <h3>Add Question</h3>
                    <p>Add a question to a quiz</p>
                </div>

            </div>
        `;

        // re-bind click handlers on the freshly injected cards,
        // since the original DOMContentLoaded listener only
        // attached to the cards that existed on page load
        exploreSection.querySelectorAll(".option").forEach(function (option) {
            option.addEventListener("click", function () {
                window.location.href = this.getAttribute("data-page");
            });
        });

    }

    // --- Side menu: swap student links for admin management links ---

    const sideMenuLinks = document.querySelector(".side-menu-links");

    if (sideMenuLinks && isAdmin) {

        sideMenuLinks.innerHTML = `
            <a href="index.html">🏠 Home</a>
            <a href="dashboard.html">📊 Dashboard</a>
            <a href="admin.html#section-resources">📚 Manage Resources</a>
            <a href="admin.html#section-users">👥 Manage Users</a>
            <a href="admin.html#section-community">💬 Manage Community</a>
            <a href="admin.html#section-create">🗺️ Create Content</a>
        `;

        // re-bind the "close menu on link click" behavior, since these
        // links are freshly injected and the original listener only
        // attached to the links that existed on page load
        sideMenuLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                const sideMenu = document.getElementById("sideMenu");
                const menuOverlay = document.getElementById("menuOverlay");
                if (sideMenu) sideMenu.classList.remove("active");
                if (menuOverlay) menuOverlay.classList.remove("active");
            });
        });

    }

        // --- Footer: swap "Quick Links" for admin management links ---

    if (isAdmin) {

        const footerSections = document.querySelectorAll(".footer-section");

        footerSections.forEach(function (section) {

            const heading = section.querySelector("h3");

            if (heading && heading.textContent.trim() === "Quick Links") {

                const list = section.querySelector("ul");

                if (list) {

                    list.innerHTML = `
                        <li><a href="admin.html#section-resources">Manage Resources</a></li>
                        <li><a href="admin.html#section-users">Manage Users</a></li>
                        <li><a href="admin.html#section-community">Manage Community</a></li>
                        <li><a href="admin.html#section-create">Create Content</a></li>
                    `;

                }

            }

        });

    }

}

/* =========================================================
   TOP RATED RESOURCES
========================================================= */

async function setupTopRatedResources() {

    const ratingContainer =
        document.getElementById("ratingContainer");


    if (!ratingContainer) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/top-rated-resources`
            );


        const data =
            await response.json();


        if (!response.ok || !data.length) {

            ratingContainer.innerHTML = `
                <p>
                    Ratings will appear here when resources are available.
                </p>
            `;

            return;

        }


        ratingContainer.innerHTML =
            data.map(function (resource) {

                return `

                    <div class="resource-card">

                        <h3>
                            ${
                                escapeHTML(
                                    resource.resource_title
                                )
                            }
                        </h3>

                        <p>
                            Topic:
                            ${
                                escapeHTML(
                                    resource.topic_name
                                )
                            }
                        </p>

                        <p>
                            Type:
                            ${
                                escapeHTML(
                                    resource.resource_type
                                )
                            }
                        </p>

                        <p>
                            ⭐ ${
                                escapeHTML(
                                    resource.average_rating
                                )
                            }
                            (
                            ${
                                escapeHTML(
                                    resource.total_ratings
                                )
                            }
                            ratings)
                        </p>

                        <a
                            href="${escapeHTML(
                                resource.resource_link
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open Resource
                        </a>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

        ratingContainer.innerHTML = `
            <p>
                Could not load top rated resources.
            </p>
        `;

    }

}

/* =========================================================
   HOME PAGE — ADMIN VIEW
   Hides the student-facing hero/search section, replaces
   "Popular Topics" with 3 admin shortcuts, and hides the
   student-facing "Learning Resources" / "Top Rated
   Resources" sections, when the logged-in user is an admin.
========================================================= */

function applyHomeAdminUI() {

    const user = getUser();
    const isAdmin = !!(user && user.role === "admin");

    if (!isAdmin) {
        return;
    }

    const heroSection = document.querySelector(".hero");
    const popularSection = document.getElementById("popularTopics")?.closest("section");
    const resourcesSection = document.getElementById("resourceContainer")?.closest("section");
    const ratingSection = document.getElementById("ratingContainer")?.closest("section");

    // not on index.html — nothing to do
    if (!popularSection) {
        return;
    }

    // hide the student-facing search/level hero entirely
    if (heroSection) {
        heroSection.style.display = "none";
    }

    popularSection.innerHTML = `
        <h2>Admin Quick Actions</h2>
        <p class="section-text">Jump straight into managing NoEtra.</p>

        <div class="option-grid">

            <div class="option" data-page="admin.html#section-resources">
                <span>📚</span>
                <h3>Manage Resources</h3>
                <p>Edit or remove learning resources</p>
            </div>

            <div class="option" data-page="admin.html#section-users">
                <span>👥</span>
                <h3>Manage Users</h3>
                <p>View registered users</p>
            </div>

            <div class="option" data-page="admin.html#section-community">
                <span>💬</span>
                <h3>Manage Community</h3>
                <p>Moderate discussions</p>
            </div>

        </div>
    `;

    popularSection.querySelectorAll(".option").forEach(function (option) {
        option.addEventListener("click", function () {
            window.location.href = this.getAttribute("data-page");
        });
    });

    // hide the student-facing browsing sections on the admin homepage
    if (resourcesSection) {
        resourcesSection.style.display = "none";
    }

    if (ratingSection) {
        ratingSection.style.display = "none";
    }

}
/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================================= */

window.logout =
    logout;

window.openPage =
    openPage;

window.goDashboard =
    goDashboard;

window.goRegister =
    goRegister;

window.forgotPassword =
    forgotPassword;

window.generateRoadmap =
    generateRoadmap;

window.bookmarkResource =
    bookmarkResource;

window.removeBookmark =
    removeBookmark;

window.deleteNote =
    deleteNote;

window.startBackendQuiz =
    startBackendQuiz;

window.submitForgotPassword =
    submitForgotPassword;

window.submitResetPassword =
    submitResetPassword;

setupTopRatedResources();
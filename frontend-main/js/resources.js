const API = "http://localhost:3000/api";

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");


/* =========================
   LOAD RESOURCES (Show All)
========================= */

async function loadResources() {

    try {

        const response = await fetch(`${API}/search`);

        const data = await response.json();

        displayResources(data.resources);

    }

    catch (error) {

        console.error(error);

        document.getElementById(
            "resourceList"
        ).textContent =
            "Resources API is not connected yet.";

    }

}


/* =========================
   DISPLAY RESOURCES
========================= */

function displayResources(resources) {

    const list =
        document.getElementById(
            "resourceList"
        );

    list.innerHTML = "";


    if (!resources || resources.length === 0) {

        list.textContent =
            "No resources found.";

        return;

    }


    resources.forEach(function(resource) {

        const div =
            document.createElement("div");

        div.classList.add("resource-card");


        const title =
            resource.resource_title ||
            "Untitled Resource";


        const topic =
            resource.topic_name || "";


        const type =
            resource.resource_type || "";


        const url =
            resource.resource_link || "#";


        div.innerHTML = `

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                Topic:
                ${escapeHTML(topic)}
            </p>

            <p>
                Type:
                ${escapeHTML(type)}
            </p>

            <a
                href="${escapeHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Open Resource
            </a>

            <br><br>

            <button
                onclick="bookmarkResource(${resource.resource_id})"
            >
                Bookmark
            </button>

            <hr>

        `;


        list.appendChild(div);

    });

}


/* =========================
   SEARCH RESOURCES
========================= */

async function searchResources() {

    const search =
        document.getElementById(
            "searchInput"
        ).value.trim();


    if (!search) {

        loadResources();

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/search?q=${encodeURIComponent(search)}`
            );


        const data =
            await response.json();


        displayResources(data.resources);

    }

    catch (error) {

        console.error(error);

        document.getElementById(
            "resourceList"
        ).textContent =
            "Search failed.";

    }

}



/* =========================
   BOOKMARK RESOURCE
========================= */

async function bookmarkResource(resourceId) {

    if (!user || !token) {

        alert(
            "Please login first."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/bookmarks`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        resourceId: resourceId

                    })

                }
            );


        const data =
            await response.json();


        alert(
            data.message ||
            "Resource bookmarked."
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Bookmark API is not connected yet."
        );

    }

}


/* =========================
   BACK TO DASHBOARD
========================= */

function goDashboard() {

    window.location.href =
        "dashboard.html";

}


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


/* =========================
   INITIAL LOAD
========================= */

document.addEventListener("DOMContentLoaded", function () {

    loadResources();

    const navbarProfile = document.getElementById("navbarProfile");

    if (navbarProfile) {

        navbarProfile.addEventListener("click", function () {

            window.location.href = "profile.html";

        });

    }


    const navbarUsername = document.getElementById("navbarUsername");

    if (navbarUsername && user) {

        const name =
            user.full_name ||
            user.username ||
            user.name ||
            user.email ||
            "User";

        navbarUsername.textContent = name;

    }

});
document.addEventListener("DOMContentLoaded", function () {

    const roadmapForm = document.getElementById("roadmapForm");
    const roadmapTopic = document.getElementById("roadmapTopic");
    const roadmapLevel = document.getElementById("roadmapLevel");

    const roadmapMessage =
        document.getElementById("roadmapMessage");

    const roadmapResult =
        document.getElementById("roadmapResult");


    // Backend API URL (matches server.js, which runs on port 3000)
    const API_URL = "http://localhost:3000/api";

    const token = localStorage.getItem("token");


    // =========================
    // FORM SUBMIT
    // =========================

    if (roadmapForm) {

        roadmapForm.addEventListener("submit", async function (event) {

            event.preventDefault();


            const topic =
                roadmapTopic.value.trim();

            const level =
                roadmapLevel.value;


            // Check input
            if (!topic || !level) {

                roadmapMessage.textContent =
                    "Please enter a topic and select a level.";

                roadmapMessage.className = "error";

                return;
            }


            // /api/generate-roadmap requires login
            if (!token) {

                roadmapMessage.textContent =
                    "Please login first.";

                roadmapMessage.className = "error";

                setTimeout(function () {
                    window.location.href = "login.html";
                }, 800);

                return;
            }


            // Loading message
            roadmapMessage.textContent =
                "Generating roadmap...";

            roadmapMessage.className = "";


            roadmapResult.innerHTML = "";


            try {

                // Backend request
                // NOTE: this is a GET request, and difficulty/level
                // isn't filtered server-side — the backend only matches
                // by topic name (LIKE %topic%) and returns whatever it finds.
                const response = await fetch(
                    `${API_URL}/generate-roadmap?topic=${encodeURIComponent(topic)}&level=${encodeURIComponent(level)}`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );


                // Backend response
                const data =
                    await response.json();


                console.log(
                    "Roadmap response:",
                    data
                );


                if (response.status === 401 || response.status === 403) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    roadmapMessage.textContent =
                        "Please login again.";

                    roadmapMessage.className = "error";

                    setTimeout(function () {
                        window.location.href = "login.html";
                    }, 800);

                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Failed to generate roadmap."
                    );
                }


                // Success
                roadmapMessage.textContent =
                    "Roadmap generated successfully!";

                roadmapMessage.className =
                    "success";


                // Display roadmap
                displayRoadmap(data);


            } catch (error) {

                console.error(
                    "Roadmap error:",
                    error
                );


                roadmapMessage.textContent =
                    error.message ||
                    "Backend is not connected yet.";

                roadmapMessage.className =
                    "error";


                roadmapResult.innerHTML = "";
            }

        });

    }


    // =========================
    // DISPLAY ROADMAP
    // =========================
    // Backend (/api/generate-roadmap) always returns a single object:
    // { result_id, topic_name, roadmap, ai_notes, difficulty, resources: [...] }

    function displayRoadmap(data) {

        if (!data || !data.topic_name) {

            roadmapResult.innerHTML =
                "<p>No roadmap found for this topic yet.</p>";

            return;
        }


        let resourcesHTML = "";


        if (data.resources && data.resources.length) {

            resourcesHTML = data.resources.map(function (resource) {

                return `

                    <div class="resource-card">

                        <h3>
                            ${escapeHTML(resource.resource_title)}
                        </h3>

                        <p>
                            ${escapeHTML(resource.resource_type)}
                        </p>

                        <a
                            href="${escapeHTML(resource.resource_link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open Resource
                        </a>

                        <button
                            onclick="bookmarkResource(${resource.resource_id})"
                        >
                            Bookmark
                        </button>

                    </div>

                `;

            }).join("");

        } else {

            resourcesHTML =
                "<p>No resources available for this topic yet.</p>";

        }


        roadmapResult.innerHTML = `

            <div class="roadmap-result-card">

                <h2>
                    ${escapeHTML(data.topic_name)}
                </h2>

                <p>
                    Difficulty:
                    <strong>
                        ${escapeHTML(data.difficulty || "Beginner")}
                    </strong>
                </p>

                ${
                    data.roadmap
                    ? `<div>${escapeHTML(data.roadmap)}</div>`
                    : ""
                }

                ${
                    data.ai_notes
                    ? `<p>${escapeHTML(data.ai_notes)}</p>`
                    : ""
                }

                <h3>
                    Learning Resources
                </h3>

                <div class="resource-container">

                    ${resourcesHTML}

                </div>

            </div>

        `;

    }


    // =========================
    // BOOKMARK RESOURCE
    // =========================

    window.bookmarkResource = async function (resourceId) {

        if (!token) {

            alert("Please login first.");

            window.location.href = "login.html";

            return;

        }


        try {

            const response = await fetch(
                `${API_URL}/bookmarks`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({ resourceId })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.error || "Could not bookmark resource.");

                return;

            }


            alert("Resource bookmarked successfully!");

        } catch (error) {

            console.error(error);

            alert("Could not connect to backend.");

        }

    };


    // =========================
    // NAVBAR: PROFILE LINK + USERNAME
    // =========================

    const navbarProfile = document.getElementById("navbarProfile");

    if (navbarProfile) {

        navbarProfile.addEventListener("click", function () {

            window.location.href = "profile.html";

        });

    }


    const navbarUsername = document.getElementById("navbarUsername");
    const savedUser = localStorage.getItem("user");

    if (navbarUsername && savedUser) {

        try {

            const user = JSON.parse(savedUser);

            const name =
                user.full_name ||
                user.username ||
                user.name ||
                user.email ||
                "User";

            navbarUsername.textContent = name;

        } catch (error) {

            console.error("User data error:", error);

        }

    }


    // =========================
    // SECURITY
    // =========================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;

    }

});
# Noetra - Frontend

Noetra is a self-learning platform frontend built with plain HTML, CSS, and JavaScript. It lets users search topics, follow learning roadmaps, take quizzes, save notes and bookmarks, track progress, rate resources, and discuss topics in a community section. It also includes an admin panel for managing content.

## Tech Stack

- HTML5
- CSS3 (single shared stylesheet)
- Vanilla JavaScript (no framework, no build step)
- Fetch API for all backend communication
- LocalStorage for storing the auth token and cached user info

## Project Structure

```
css/
  style.css

js/
  script.js       shared logic used across most pages (auth, navbar, dashboard, search, notes, bookmarks, progress, quiz, community, role-based UI)
  admin.js        admin panel logic
  bookmark.js     bookmark page logic
  resources.js    resources page logic
  roadmap.js      roadmap generator logic

index.html
login.html
register.html
forgot-password.html
dashboard.html
notes.html
quiz.html
community.html
bookmark.html
resources.html
roadmap.html
progress.html
rating.html
profile.html
admin.html
```

## Pages

- **index.html** - Landing page with topic search, learning level selection, popular topics, learning resources preview, and top rated resources.
- **login.html** - User login form with a link to registration and password recovery.
- **register.html** - New account registration form.
- **forgot-password.html** - Request a password reset link.
- **dashboard.html** - Personalized hub with search and quick access to all main features. Shows a different set of options for admin accounts.
- **notes.html** - Create, view, and delete personal notes.
- **quiz.html** - Browse and take quizzes with instant scoring.
- **community.html** - Post and view discussion threads.
- **bookmark.html** - View and remove saved resources.
- **resources.html** - Search and browse learning resources, with the option to bookmark them.
- **roadmap.html** - Generate a learning roadmap for a topic and difficulty level.
- **progress.html** - View overall learning progress and completed topics.
- **rating.html** - Rate resources and view existing ratings.
- **profile.html** - View and update account details.
- **admin.html** - Manage resources, users, community discussions, topics, and quizzes.

## Core Features

- Authentication with token-based sessions stored in localStorage
- Role-based interface that adapts the dashboard, navigation, and homepage for admin accounts
- Topic search with roadmap generation
- Learning resource browsing, bookmarking, and rating
- Personal notes management
- Quiz taking with scoring
- Community discussion posting
- Progress tracking
- Admin tools for managing resources, users, discussions, topics, and quizzes
- Light and dark theme toggle, saved to localStorage

## Setup

1. Make sure the backend API is running (default expected at `http://localhost:3000/api`).
2. Serve this folder with any static file server, for example the VS Code Live Server extension.
3. Open `index.html` in the browser.

No build step or dependencies are required for the frontend.

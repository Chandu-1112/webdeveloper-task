# OpportunityHub

OpportunityHub is a web application that helps college students discover different opportunities in one place. Students can explore internships, hackathons, scholarships, workshops, and competitions.

The goal is to make finding useful career and learning opportunities easier for students.

## Project Link

- **Live Demo:** https://webdeveloper-task-zuwr.onrender.com

## Features

- View different opportunities with their details.
- Browse community event listings without signing in.
- Search opportunities by title or organization name.
- Filter opportunities by category.
- View detailed information about each opportunity.
- Create an account and log in.
- Save sample and community opportunities to your account database.
- Publish opportunities with eligibility, location, deadline, skills, and application instructions.
- Manage your published opportunities by editing or deleting them, and copy a public link to share each listing.
- Responsive design for mobile and desktop.
- Installable as a web app on supported browsers.

## Tech Stack

- React
- TypeScript (TSX)
- Tailwind CSS
- Vite
- FastAPI
- PostgreSQL with SQLAlchemy
- LocalStorage for the login token only

## Getting Started

Follow these steps to run the project locally.

**1. Clone the repository**

```bash
git clone https://github.com/Chandu-1112/webdeveloper-task.git
```

**2. Open the project folder**

```bash
cd webdeveloper-task
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure the API URL**

Copy `.env.example` to `.env` in the repository root. The default points to `http://localhost:8000`.

**5. Start the backend**

Follow [backend/README.md](backend/README.md) to create the PostgreSQL database and start FastAPI in its own terminal.

**6. Start the frontend**

```bash
npm run dev
```

Open the local URL displayed in the terminal to view the application.

## Backend API

The frontend uses the FastAPI backend for registration/login, community opportunity listings, and user-specific bookmarks. API-created listings are visible on the opportunity board and show the submitter's name. Bookmarks for both sample and community listings are stored in PostgreSQL. Existing browser-only sample bookmarks are imported to the signed-in account on first login.

For deployment, the frontend can stay on Render while the API runs as a Vercel project with `backend/` as its root directory and Neon as its PostgreSQL database. Follow [backend/README.md](backend/README.md) for the Vercel and Neon setup.

## Project Structure

```text
src/
├── components/
├── pages/
├── data/
├── types/
├── hooks/
├── services/
├── App.tsx
├── main.tsx
└── index.css

backend/
├── app/
├── migrations/
├── requirements.txt
└── README.md

public/
package.json
README.md
```

## Sample Data

The application currently uses sample opportunity listings for demonstration purposes. The organizations, descriptions, and deadlines are fictional and are not verified real-world opportunities.

## Technical Decision

I chose React because it makes it easier to build reusable components and manage the application UI. TypeScript helps maintain proper data types, while Tailwind CSS makes responsive styling easier.

The backend validates passwords, stores password hashes rather than plaintext passwords, and authenticates protected requests with bearer tokens. The browser stores the access token locally, but never stores bookmarks. Community listings display the submitter's name and should be verified with the listed organization.

## Bug Fixed

During testing, I identified an issue with searching when users entered unnecessary spaces.

I fixed it by using `trim()` and `toLowerCase()` to normalize the search input before matching titles and organization names.

## Known Limitations

- PostgreSQL and the FastAPI backend must be running for login, publishing, and account bookmarks.
- The preloaded demo opportunities are fictional sample data.
- Login, publishing, and bookmarks require a running PostgreSQL database and FastAPI backend.
- Community-submitted opportunity details are not independently verified.
- App installation is available through the browser on supported devices; no native APK is provided.

## AI Tools Used

ChatGPT was used for understanding concepts and documentation.
Github copilot for coding and debugging.


## Further Improvements

- Add community listing moderation.
- Add deadline reminders and opportunity recommendations.

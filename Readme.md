# OpportunityHub 🚀

OpportunityHub is a web application that helps college students discover different opportunities in one place. Students can explore internships, hackathons, scholarships, workshops, and competitions.

The goal is to make finding useful career and learning opportunities easier for students.

## Features

- View different opportunities with their details.
- Search opportunities by title or organization name.
- Filter opportunities by category.
- View detailed information about each opportunity.
- Bookmark opportunities and access them later.
- Save bookmarks using browser LocalStorage.
- Responsive design for mobile and desktop.

## Tech Stack

- React
- TypeScript (TSX)
- Tailwind CSS
- Vite
- LocalStorage

## Getting Started

Follow these steps to run the project locally.

**1. Clone the repository**

```bash
git clone <your-repository-url>
```

**2. Open the project folder**

```bash
cd opportunity-hub
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local URL displayed in the terminal to view the application.

## Project Structure

```text
src/
├── components/
├── pages/
├── data/
├── types/
├── hooks/
├── App.tsx
├── main.tsx
└── index.css

public/
package.json
README.md
```

## Sample Data

The application currently uses sample opportunity listings for demonstration purposes. The organizations, descriptions, and deadlines are fictional and are not verified real-world opportunities.

## Technical Decision

I chose React because it makes it easier to build reusable components and manage the application UI. TypeScript helps maintain proper data types, while Tailwind CSS makes responsive styling easier.

LocalStorage is used to save bookmarked opportunities without requiring a backend.

## Bug Fixed

During testing, I identified an issue with searching when users entered unnecessary spaces.

I fixed it by using `trim()` and `toLowerCase()` to normalize the search input before matching titles and organization names.

## Known Limitations

- No backend or database integration.
- No user login or registration.
- Opportunities are stored as local sample data.
- Bookmarks are saved in the browser's LocalStorage.
- The Download App button requires a valid app download link to provide an actual download.

## AI Tools Used

ChatGPT was used for understanding concepts and documentation.
Github copilot for coding and debugging.

## Project Links

- **GitHub Repository:** Add your repository link here.
- **Live Demo:** Add your deployed website link here.
- **Screen Recording:** Add your demo recording link here if available.

## Further Improvements
->If we want to take it further we can include the following features:
- User authentication.
- Backend and database integration.
- Admin dashboard to manage opportunities.
- Real-time opportunity updates.
- Notifications for upcoming deadlines.
- AI-based opportunity recommendations.

---
